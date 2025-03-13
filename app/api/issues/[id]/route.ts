import { NextRequest, NextResponse } from 'next/server';
import { mockIssues } from '../route';
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
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: string;
  department: string;
  issueType: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
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
  solution: string | null;
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
    console.error('이슈 데이터 로드 중 오류 발생:', error);
    return [];
  }
};

// 이슈 데이터 저장
const saveIssues = (issues: Issue[]): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(ISSUES_FILE, JSON.stringify(issues, null, 2));
  } catch (error) {
    console.error('이슈 데이터 저장 중 오류 발생:', error);
  }
};

// 이슈 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 해당 ID의 이슈 찾기
    const issue = issues.find(issue => issue.id === issueId);
    
    if (!issue) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 최관리자가 발견자인 경우 부서 정보 추가
    if (issue.createdBy.id === 'worker-4' && !issue.createdBy.department) {
      issue.createdBy.department = '안전';
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error('이슈 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '이슈 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 이슈 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.title) {
      return NextResponse.json({ error: '제목은 필수 항목입니다.' }, { status: 400 });
    }
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 해당 ID의 이슈 찾기
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 이슈 업데이트
    const updatedIssue: Issue = {
      ...issues[issueIndex],
      title: data.title,
      description: data.description || issues[issueIndex].description,
      status: data.status || issues[issueIndex].status,
      priority: data.priority || issues[issueIndex].priority,
      department: data.department || issues[issueIndex].department,
      updatedAt: new Date().toISOString(),
      solution: data.solution !== undefined ? data.solution : issues[issueIndex].solution
    };
    
    // 상태가 RESOLVED로 변경된 경우 resolvedAt 설정
    if (data.status === 'RESOLVED' && issues[issueIndex].status !== 'RESOLVED') {
      updatedIssue.resolvedAt = new Date().toISOString();
    }
    
    // 이슈 배열 업데이트
    issues[issueIndex] = updatedIssue;
    
    // 이슈 데이터 저장
    saveIssues(issues);
    
    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('이슈 수정 중 오류 발생:', error);
    return NextResponse.json({ error: '이슈 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 이슈 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 해당 ID의 이슈 찾기
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 이슈 삭제
    issues.splice(issueIndex, 1);
    
    // 이슈 데이터 저장
    saveIssues(issues);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('이슈 삭제 중 오류 발생:', error);
    return NextResponse.json({ error: '이슈 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 