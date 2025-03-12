import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');

// 이슈 인터페이스 정의
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  department: string;
  issueType: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
    department?: string;
    companyId?: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
    companyId: string;
    department?: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

// 작업자 인터페이스 정의
interface Worker {
  id: string;
  name: string;
  companyId: string;
  department?: string;
}

// 이슈 데이터 로드
const loadIssues = (): Issue[] => {
  try {
    if (!fs.existsSync(ISSUES_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(ISSUES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('이슈 데이터 로드 오류:', error);
    return [];
  }
};

// 사용자 데이터 로드 (매니저와 관리자 정보를 가져오기 위함)
const loadUsers = (): any[] => {
  try {
    const usersFile = path.join(DATA_DIR, 'users.json');
    if (!fs.existsSync(usersFile)) {
      return [];
    }
    
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 데이터 로드 오류:', error);
    return [];
  }
};

export async function GET(request: NextRequest) {
  try {
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // URL에서 날짜 필터 파라미터 추출
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // 날짜 필터 추출
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    
    // 날짜 필터 적용
    let filteredIssues = [...issues];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 종료일의 끝으로 설정
      
      filteredIssues = filteredIssues.filter(issue => {
        const createdAt = new Date(issue.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    } else if (month) {
      const currentYear = new Date().getFullYear();
      const monthIndex = parseInt(month) - 1; // JavaScript의 월은 0부터 시작
      
      filteredIssues = filteredIssues.filter(issue => {
        const createdAt = new Date(issue.createdAt);
        return createdAt.getMonth() === monthIndex;
      });
    }
    
    // 통계 계산
    const totalIssues = filteredIssues.length;
    const openIssues = filteredIssues.filter(issue => issue.status === 'OPEN' || issue.status === 'IN_PROGRESS').length;
    const resolvedIssues = filteredIssues.filter(issue => issue.status === 'RESOLVED' || issue.status === 'CLOSED').length;
    const criticalIssues = filteredIssues.filter(issue => issue.priority === 'CRITICAL').length;
    
    // 우선순위별 이슈 수
    const issuesByPriority = filteredIssues.reduce((acc: Record<string, number>, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1;
      return acc;
    }, {});
    
    // 부서별 이슈 수
    const issuesByDepartment = filteredIssues.reduce((acc: Record<string, number>, issue) => {
      acc[issue.department] = (acc[issue.department] || 0) + 1;
      return acc;
    }, {});
    
    // 일별 이슈 수 (최근 14일)
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const issuesByDay: Record<string, number> = {};
    
    // 최근 14일 날짜 초기화
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      issuesByDay[dateString] = 0;
    }
    
    // 이슈 날짜별 카운트
    filteredIssues.forEach(issue => {
      const createdAt = new Date(issue.createdAt);
      if (createdAt >= twoWeeksAgo) {
        const dateString = createdAt.toISOString().split('T')[0];
        issuesByDay[dateString] = (issuesByDay[dateString] || 0) + 1;
      }
    });
    
    // 가장 많은 이슈를 보고한 작업자 Top 5
    const reporterCounts: Record<string, { id: string; name: string; department: string; count: number }> = {};
    
    filteredIssues.forEach(issue => {
      const reporterId = issue.createdBy.id;
      if (!reporterCounts[reporterId]) {
        reporterCounts[reporterId] = {
          id: reporterId,
          name: issue.createdBy.name,
          department: issue.createdBy.department || '미지정',
          count: 0
        };
      }
      reporterCounts[reporterId].count++;
    });
    
    const topReporters = Object.values(reporterCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(reporter => ({
        ...reporter,
        percentage: Math.round((reporter.count / totalIssues) * 100)
      }));
    
    // 사용자 데이터 로드
    const users = loadUsers();
    
    // 매니저와 관리자 ID 목록 생성
    const managerIds = users
      .filter(user => user.role === 'MANAGER' || user.role === 'ADMIN')
      .map(user => user.id);
    
    // 가장 많은 이슈를 해결한 매니저/관리자 Top 5
    const resolverCounts: Record<string, { id: string; name: string; department: string; count: number }> = {};
    
    filteredIssues
      .filter(issue => issue.status === 'RESOLVED' || issue.status === 'CLOSED')
      .forEach(issue => {
        if (issue.assignedTo && managerIds.includes(issue.assignedTo.id)) {
          const resolverId = issue.assignedTo.id;
          if (!resolverCounts[resolverId]) {
            // 사용자 정보에서 부서 정보 가져오기
            const user = users.find(u => u.id === resolverId);
            const department = user ? user.department : (issue.assignedTo.department || '미지정');
            
            resolverCounts[resolverId] = {
              id: resolverId,
              name: issue.assignedTo.name,
              department: department,
              count: 0
            };
          }
          resolverCounts[resolverId].count++;
        }
      });
    
    const topResolvers = Object.values(resolverCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(resolver => ({
        ...resolver,
        percentage: Math.round((resolver.count / resolvedIssues) * 100) || 0
      }));
    
    // 매니저 워크로드 계산
    const managerWorkload = topResolvers.map(resolver => {
      // 매니저에게 할당된 모든 이슈
      const assignedIssues = filteredIssues.filter(issue => 
        issue.assignedTo && issue.assignedTo.id === resolver.id
      );
      
      // 해결된 이슈
      const resolvedIssues = assignedIssues.filter(issue => 
        issue.status === 'RESOLVED' || issue.status === 'CLOSED'
      );
      
      // 대기 중인 이슈 (OPEN 또는 IN_PROGRESS)
      const pendingIssues = assignedIssues.filter(issue => 
        issue.status === 'OPEN' || issue.status === 'IN_PROGRESS'
      );
      
      return {
        id: resolver.id,
        name: resolver.name,
        department: resolver.department,
        assignedCount: assignedIssues.length,
        resolvedCount: resolvedIssues.length,
        pendingCount: pendingIssues.length
      };
    });
    
    // 평균 해결 시간 계산 (시간 단위)
    let totalResolutionTime = 0;
    let resolvedCount = 0;
    
    filteredIssues
      .filter(issue => issue.resolvedAt)
      .forEach(issue => {
        const createdAt = new Date(issue.createdAt).getTime();
        const resolvedAt = new Date(issue.resolvedAt as string).getTime();
        const resolutionTime = (resolvedAt - createdAt) / (1000 * 60 * 60); // 시간 단위로 변환
        totalResolutionTime += resolutionTime;
        resolvedCount++;
      });
    
    const averageResolutionTime = resolvedCount > 0 
      ? Math.round(totalResolutionTime / resolvedCount) 
      : 0;
    
    // 최근 중요 이슈 (우선순위가 높거나 긴급한 이슈)
    const recentImportantIssues = filteredIssues
      .filter(issue => issue.priority === 'HIGH' || issue.priority === 'CRITICAL')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(issue => ({
        id: issue.id,
        title: issue.title,
        priority: issue.priority,
        status: issue.status,
        department: issue.department,
        createdAt: issue.createdAt,
        assignedTo: issue.assignedTo ? issue.assignedTo.name : '미배정'
      }));
    
    // 응답 데이터 구성
    const response = {
      totalIssues,
      openIssues,
      resolvedIssues,
      criticalIssues,
      issuesByPriority,
      issuesByDepartment,
      issuesByDay,
      topReporters,
      topResolvers,
      averageResolutionTime,
      recentImportantIssues,
      managerWorkload
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('대시보드 통계 계산 중 오류 발생:', error);
    return NextResponse.json(
      { error: '대시보드 통계를 계산하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 