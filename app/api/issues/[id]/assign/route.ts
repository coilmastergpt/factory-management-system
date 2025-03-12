import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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
    department?: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
    companyId: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  solution: string | null;
}

// 사용자 인터페이스 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
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

// 사용자 데이터 로드
const loadUsers = (): User[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 데이터 로드 중 오류 발생:', error);
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

// 담당자 할당 API
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    const { assignedToId } = await request.json();
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 해당 ID의 이슈 찾기
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 담당자 정보 설정
    if (!assignedToId) {
      // 담당자 제거
      issues[issueIndex].assignedTo = null;
    } else {
      // 사용자 관리에서 담당자 찾기
      const users = loadUsers();
      const user = users.find(user => user.id === assignedToId);
      
      if (!user) {
        return NextResponse.json({ error: '담당자를 찾을 수 없습니다.' }, { status: 404 });
      }
      
      // 담당자 정보 설정
      issues[issueIndex].assignedTo = {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department
      };
    }
    
    // 이슈 업데이트 시간 갱신
    issues[issueIndex].updatedAt = new Date().toISOString();
    
    // 이슈 데이터 저장
    saveIssues(issues);
    
    return NextResponse.json(issues[issueIndex]);
  } catch (error) {
    console.error('담당자 할당 중 오류 발생:', error);
    return NextResponse.json({ error: '담당자 할당 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 