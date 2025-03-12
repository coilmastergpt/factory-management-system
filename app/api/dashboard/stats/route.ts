import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 모의 대시보드 통계 데이터 생성
    const mockStats = {
      totalIssues: 125,
      openIssues: 42,
      resolvedIssues: 68,
      criticalIssues: 15,
      recentActivity: {
        newIssues: 23,
        resolvedIssues: 18,
        percentChange: 12.5
      },
      byDepartment: [
        {
          department: '생산',
          count: 48,
          percentage: 38
        },
        {
          department: '품질',
          count: 32,
          percentage: 26
        },
        {
          department: '유지보수',
          count: 28,
          percentage: 22
        },
        {
          department: '안전',
          count: 17,
          percentage: 14
        }
      ],
      byStatus: [
        {
          status: 'OPEN',
          label: '미해결',
          count: 42,
          percentage: 34
        },
        {
          status: 'IN_PROGRESS',
          label: '진행 중',
          count: 15,
          percentage: 12
        },
        {
          status: 'RESOLVED',
          label: '해결됨',
          count: 68,
          percentage: 54
        }
      ],
      byPriority: [
        {
          priority: 'LOW',
          label: '낮음',
          count: 35,
          percentage: 28,
          color: 'gray'
        },
        {
          priority: 'MEDIUM',
          label: '중간',
          count: 45,
          percentage: 36,
          color: 'blue'
        },
        {
          priority: 'HIGH',
          label: '높음',
          count: 30,
          percentage: 24,
          color: 'orange'
        },
        {
          priority: 'CRITICAL',
          label: '긴급',
          count: 15,
          percentage: 12,
          color: 'red'
        }
      ],
      // 작업자별 통계 추가
      byWorker: [
        {
          id: 'worker-1',
          name: '김작업자',
          department: '생산',
          count: 32,
          percentage: 26
        },
        {
          id: 'worker-2',
          name: '이엔지니어',
          department: '품질',
          count: 28,
          percentage: 22
        },
        {
          id: 'worker-3',
          name: '박기술자',
          department: '유지보수',
          count: 25,
          percentage: 20
        },
        {
          id: 'worker-4',
          name: '최관리자',
          department: '안전',
          count: 22,
          percentage: 18
        },
        {
          id: 'worker-5',
          name: '정감독관',
          department: '생산',
          count: 18,
          percentage: 14
        }
      ],
      // 월별 작업자 통계 추가
      monthlyWorkerStats: [
        {
          month: '1월',
          stats: [
            { id: 'worker-1', name: '김작업자', count: 8 },
            { id: 'worker-2', name: '이엔지니어', count: 6 },
            { id: 'worker-3', name: '박기술자', count: 5 },
            { id: 'worker-4', name: '최관리자', count: 4 },
            { id: 'worker-5', name: '정감독관', count: 3 }
          ]
        },
        {
          month: '2월',
          stats: [
            { id: 'worker-1', name: '김작업자', count: 7 },
            { id: 'worker-2', name: '이엔지니어', count: 8 },
            { id: 'worker-3', name: '박기술자', count: 6 },
            { id: 'worker-4', name: '최관리자', count: 5 },
            { id: 'worker-5', name: '정감독관', count: 4 }
          ]
        },
        {
          month: '3월',
          stats: [
            { id: 'worker-1', name: '김작업자', count: 9 },
            { id: 'worker-2', name: '이엔지니어', count: 7 },
            { id: 'worker-3', name: '박기술자', count: 8 },
            { id: 'worker-4', name: '최관리자', count: 6 },
            { id: 'worker-5', name: '정감독관', count: 5 }
          ]
        },
        {
          month: '4월',
          stats: [
            { id: 'worker-1', name: '김작업자', count: 8 },
            { id: 'worker-2', name: '이엔지니어', count: 7 },
            { id: 'worker-3', name: '박기술자', count: 6 },
            { id: 'worker-4', name: '최관리자', count: 7 },
            { id: 'worker-5', name: '정감독관', count: 6 }
          ]
        }
      ],
      // 이슈 유형별 통계
      byIssueType: [
        {
          type: 'EQUIPMENT',
          label: '설비 문제',
          count: 45,
          percentage: 36
        },
        {
          type: 'MATERIAL',
          label: '원자재 문제',
          count: 30,
          percentage: 24
        },
        {
          type: 'WORKER',
          label: '작업자 문제',
          count: 25,
          percentage: 20
        },
        {
          type: 'JIG',
          label: '지그 문제',
          count: 15,
          percentage: 12
        },
        {
          type: 'EPOXY',
          label: '에폭시 물성',
          count: 10,
          percentage: 8
        }
      ],
      // 시간에 따른 이슈 추이
      issuesTrend: [
        { date: '2023-01-01', open: 5, resolved: 3 },
        { date: '2023-02-01', open: 8, resolved: 4 },
        { date: '2023-03-01', open: 12, resolved: 7 },
        { date: '2023-04-01', open: 10, resolved: 9 },
        { date: '2023-05-01', open: 15, resolved: 11 },
        { date: '2023-06-01', open: 18, resolved: 14 },
        { date: '2023-07-01', open: 14, resolved: 16 },
        { date: '2023-08-01', open: 12, resolved: 13 },
        { date: '2023-09-01', open: 16, resolved: 12 },
        { date: '2023-10-01', open: 20, resolved: 15 },
        { date: '2023-11-01', open: 18, resolved: 17 },
        { date: '2023-12-01', open: 15, resolved: 16 }
      ],
      // 평균 해결 시간 (시간 단위)
      averageResolutionTime: {
        overall: 48,
        byPriority: [
          { priority: 'LOW', label: '낮음', time: 72 },
          { priority: 'MEDIUM', label: '중간', time: 48 },
          { priority: 'HIGH', label: '높음', time: 24 },
          { priority: 'CRITICAL', label: '긴급', time: 12 }
        ]
      },
      // 최근 추가된 이슈 목록
      recentIssues: [
        {
          id: 'issue-1',
          title: '생산라인 3 컨베이어 벨트 고장',
          priority: 'HIGH',
          status: 'OPEN',
          reporter: '김작업자',
          createdAt: '2023-12-15T09:30:00Z'
        },
        {
          id: 'issue-2',
          title: '품질검사 장비 캘리브레이션 필요',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          reporter: '이엔지니어',
          createdAt: '2023-12-14T14:20:00Z'
        },
        {
          id: 'issue-3',
          title: '에폭시 경화 시간 이상',
          priority: 'CRITICAL',
          status: 'OPEN',
          reporter: '박기술자',
          createdAt: '2023-12-14T11:15:00Z'
        },
        {
          id: 'issue-4',
          title: '안전 가드 파손',
          priority: 'HIGH',
          status: 'OPEN',
          reporter: '최관리자',
          createdAt: '2023-12-13T16:45:00Z'
        },
        {
          id: 'issue-5',
          title: '원자재 불량',
          priority: 'MEDIUM',
          status: 'RESOLVED',
          reporter: '정감독관',
          createdAt: '2023-12-12T10:30:00Z'
        }
      ]
    };
    
    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('대시보드 통계 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드 통계 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 