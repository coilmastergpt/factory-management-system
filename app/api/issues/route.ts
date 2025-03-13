import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// 모의 데이터 생성
const workers = [
  { id: 'worker-1', name: '김작업자', email: 'kim@example.com', companyId: 'EMP001', department: '생산' },
  { id: 'worker-2', name: '이엔지니어', email: 'lee@example.com', companyId: 'EMP002', department: '품질' },
  { id: 'worker-3', name: '박기술자', email: 'park@example.com', companyId: 'EMP003', department: '유지보수' },
  { id: 'worker-4', name: 'Thomas cha', email: 'choi@example.com', companyId: 'EMP004', department: '안전' },
  { id: 'worker-5', name: '정감독관', email: 'jung@example.com', companyId: 'EMP005', department: '안전' }
];

const issueTypes = [
  { id: 'type-1', name: '설비 문제', value: '설비 문제' },
  { id: 'type-2', name: '원자재 문제', value: '원자재 문제' },
  { id: 'type-3', name: '작업자 문제', value: '작업자 문제' },
  { id: 'type-4', name: '지그 문제', value: '지그 문제' }
];

// 사용자 인터페이스 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
  companyId?: string;
}

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
  attachments?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
}

// 사용자 데이터 로드
const loadUsers = (): User[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 데이터 로드 오류:', error);
    return [];
  }
};

// 모의 이슈 데이터 생성
const generateMockIssues = (count: number): Issue[] => {
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const departments = ['생산', '품질', '유지보수', '안전'];
  
  return Array.from({ length: count }).map((_, index) => {
    const createdBy = workers[Math.floor(Math.random() * workers.length)];
    const assignedToIndex = Math.floor(Math.random() * (workers.length + 1)) - 1;
    const assignedTo = assignedToIndex >= 0 ? workers[assignedToIndex] : null;
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)].value;
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 5));
    
    // 해결된 이슈인 경우 완료일 추가
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let resolvedAt = null;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      resolvedAt = new Date(updatedDate);
      resolvedAt.setDate(resolvedAt.getDate() + Math.floor(Math.random() * 3) + 1);
    }
    
    return {
      id: `issue-${index + 1}`,
      title: `${departments[Math.floor(Math.random() * departments.length)]} 부서 문제`,
      description: `이슈에 대한 상세 설명입니다. 이 문제는 ${createdDate.toLocaleDateString()}에 발생했습니다.`,
      status: status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      issueType: issueType,
      assignedTo: assignedTo,
      createdBy: {
        id: createdBy.id,
        name: createdBy.name,
        email: createdBy.email,
        companyId: createdBy.companyId || '',
        department: createdBy.department
      },
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      resolvedAt: resolvedAt ? resolvedAt.toISOString() : null,
      solution: resolvedAt ? `이슈 ${index + 1}에 대한 해결 방법입니다.` : null
    };
  });
};

// 이슈 데이터 로드
const loadIssues = (): Issue[] => {
  try {
    // 데이터 디렉토리가 없으면 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // 이슈 파일이 없으면 초기 데이터 생성
    if (!fs.existsSync(ISSUES_FILE)) {
      const initialIssues = generateMockIssues(50);
      fs.writeFileSync(ISSUES_FILE, JSON.stringify(initialIssues, null, 2));
      return initialIssues;
    }
    
    // 파일에서 이슈 데이터 로드
    const data = fs.readFileSync(ISSUES_FILE, 'utf8');
    
    // 파일이 비어있거나 유효하지 않은 JSON인 경우 초기 데이터 생성
    if (!data || data.trim() === '[]' || data.trim() === '') {
      const initialIssues = generateMockIssues(50);
      fs.writeFileSync(ISSUES_FILE, JSON.stringify(initialIssues, null, 2));
      return initialIssues;
    }
    
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error('JSON 파싱 오류, 초기 데이터 생성:', parseError);
      const initialIssues = generateMockIssues(50);
      fs.writeFileSync(ISSUES_FILE, JSON.stringify(initialIssues, null, 2));
      return initialIssues;
    }
  } catch (error) {
    console.error('이슈 데이터 로드 중 오류 발생:', error);
    return generateMockIssues(50); // 오류 발생 시 기본 데이터 반환
  }
};

// 이슈 데이터 저장
const saveIssues = (issues: Issue[]): void => {
  try {
    // 데이터 디렉토리가 없으면 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(ISSUES_FILE, JSON.stringify(issues, null, 2));
  } catch (error) {
    console.error('이슈 데이터 저장 중 오류 발생:', error);
  }
};

// 이슈 데이터 로드
export let mockIssues = loadIssues();

export async function GET(request: NextRequest) {
  try {
    // 최신 이슈 데이터 로드
    mockIssues = loadIssues();
    
    // URL에서 필터, 검색, 정렬, 페이지네이션 파라미터 추출
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // 필터 파라미터 추출
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');
    const departmentFilter = searchParams.get('department');
    const assignedToFilter = searchParams.get('assignedToId');
    const createdByFilter = searchParams.get('createdById');
    const issueTypeFilter = searchParams.get('issueType');
    
    // 날짜 필터 추출
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    
    // 검색어 추출
    const searchTerm = searchParams.get('search');
    
    // 정렬 파라미터 추출
    const sortField = searchParams.get('sort[field]') || 'createdAt';
    const sortOrder = searchParams.get('sort[order]') || 'desc';
    
    // 페이지네이션 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // 필터링 적용
    let filteredIssues = [...mockIssues];
    
    if (statusFilter) {
      filteredIssues = filteredIssues.filter(issue => issue.status === statusFilter);
    }
    
    if (priorityFilter) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === priorityFilter);
    }
    
    if (departmentFilter) {
      filteredIssues = filteredIssues.filter(issue => issue.department === departmentFilter);
    }
    
    if (assignedToFilter) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.assignedTo && issue.assignedTo.id === assignedToFilter
      );
    }
    
    if (createdByFilter) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.createdBy && issue.createdBy.id === createdByFilter
      );
    }
    
    if (issueTypeFilter) {
      filteredIssues = filteredIssues.filter(issue => issue.issueType === issueTypeFilter);
    }
    
    // 검색어 적용
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredIssues = filteredIssues.filter(issue => 
        issue.title.toLowerCase().includes(searchLower) || 
        issue.description.toLowerCase().includes(searchLower)
      );
    }
    
    // 날짜 필터 적용
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
    
    // 정렬 적용
    filteredIssues.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // 날짜 비교
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        return sortOrder === 'asc' 
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
      }
      
      return 0;
    });
    
    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);
    
    // 응답 데이터 구성
    const response = {
      issues: paginatedIssues,
      pagination: {
        total: filteredIssues.length,
        page,
        limit,
        totalPages: Math.ceil(filteredIssues.length / limit)
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('이슈 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이슈 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('이슈 생성 요청 받음');
  
  try {
    // 요청 데이터 파싱
    const data = await request.json();
    console.log('이슈 생성 요청 데이터:', data);
    
    // 필수 필드 검증
    if (!data.title || !data.priority || !data.department || !data.issueType || !data.createdById) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }
    
    // 작업자 데이터 가져오기
    const settingsResponse = await fetch(new URL('/api/settings', request.url));
    const settingsData = await settingsResponse.json();
    const workers = settingsData.workers || [];
    
    console.log('작업자 데이터:', workers);
    
    // 작업자 ID로 작업자 찾기
    const createdByWorker = workers.find((worker: any) => worker.id === data.createdById);
    console.log('찾은 작업자:', createdByWorker, '요청된 ID:', data.createdById);
    
    if (!createdByWorker) {
      return NextResponse.json({ error: '유효하지 않은 작업자 ID입니다.' }, { status: 400 });
    }
    
    // 담당자 정보 가져오기
    let assignedTo = null;
    if (data.assignedToId) {
      const usersResponse = await fetch(new URL('/api/users', request.url));
      const users = await usersResponse.json();
      const assignedUser = users.find((user: any) => user.id === data.assignedToId);
      
      if (assignedUser) {
        assignedTo = {
          id: assignedUser.id,
          name: assignedUser.name,
          email: assignedUser.email
        };
      }
    }
    
    // 기존 이슈 데이터 로드
    let issues: Issue[] = [];
    if (fs.existsSync(ISSUES_FILE)) {
      const fileData = fs.readFileSync(ISSUES_FILE, 'utf8');
      issues = JSON.parse(fileData);
    }
    
    // 새 이슈 ID 생성 (순차적 ID)
    let newId = '1';
    if (issues.length > 0) {
      const issueIds = issues.map(issue => parseInt(issue.id)).filter(id => !isNaN(id));
      if (issueIds.length > 0) {
        const maxId = Math.max(...issueIds);
        newId = String(maxId + 1);
      }
    }
    
    // 현재 시간
    const now = new Date().toISOString();
    
    // 새 이슈 객체 생성
    const newIssue: Issue = {
      id: newId,
      title: data.title,
      description: data.description || '',
      status: 'OPEN',
      priority: data.priority,
      department: data.department,
      issueType: data.issueType,
      assignedTo,
      createdBy: {
        id: createdByWorker.id,
        name: createdByWorker.name,
        email: createdByWorker.email || '',
        companyId: createdByWorker.companyId,
        department: createdByWorker.department
      },
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      solution: null,
      attachments: data.attachments || []
    };
    
    // 이슈 추가 및 저장
    issues.push(newIssue);
    
    // 데이터 디렉토리가 없으면 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // 파일에 저장
    fs.writeFileSync(ISSUES_FILE, JSON.stringify(issues, null, 2));
    
    return NextResponse.json(newIssue);
  } catch (error) {
    console.error('이슈 생성 오류:', error);
    return NextResponse.json({ error: '이슈 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 