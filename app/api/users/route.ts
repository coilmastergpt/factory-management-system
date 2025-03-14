import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// 사용자 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
  companyId?: string;
}

// 데이터 파일 경로
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// 데이터 디렉토리 확인 및 생성
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 사용자 데이터 불러오기
const loadUsers = (): User[] => {
  ensureDataDirectory();
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    // 초기 데이터 생성
    const initialUsers: User[] = [
      { id: '1', name: '관리자', email: 'admin@example.com', role: 'ADMIN', department: '시스템관리', createdAt: new Date().toISOString(), companyId: 'ADMIN-001' },
      { id: '2', name: '매니저', email: 'manager@example.com', role: 'MANAGER', department: '운영', createdAt: new Date().toISOString(), companyId: 'MGR-001' },
      { id: '3', name: '사용자1', email: 'user1@example.com', role: 'USER', department: '생산', createdAt: new Date().toISOString(), companyId: 'USR-001' },
      { id: '4', name: '사용자2', email: 'user2@example.com', role: 'USER', department: '품질관리', createdAt: new Date().toISOString(), companyId: 'USR-002' },
    ];
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialUsers, null, 2));
    return initialUsers;
  }
  
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data) as User[];
  } catch (error) {
    console.error('사용자 데이터 로딩 오류:', error);
    return [];
  }
};

// 사용자 데이터 저장
const saveUsers = (users: User[]) => {
  ensureDataDirectory();
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(users, null, 2));
};

// 사용자 목록 가져오기
export async function GET(request: NextRequest) {
  try {
    // URL에서 검색 매개변수 추출
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const department = searchParams.get('department');
    const search = searchParams.get('search')?.toLowerCase();

    // 사용자 데이터 불러오기
    const users = loadUsers();

    // 필터링 적용
    let filteredUsers = [...users];
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => 
        user.role.toLowerCase() === role.toLowerCase()
      );
    }
    
    if (department) {
      filteredUsers = filteredUsers.filter(user => 
        user.department.toLowerCase() === department.toLowerCase()
      );
    }
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error('사용자 목록 가져오기 오류:', error);
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // 필수 필드 검증
    if (!userData.name || !userData.email || !userData.role || !userData.department) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }
    
    // 작업자 관리에 등록된 직원 ID인지 확인
    if (userData.companyId) {
      // 작업자 데이터 로드
      const workersResponse = await fetch(new URL('/api/settings?type=workers', request.url));
      if (!workersResponse.ok) {
        throw new Error('작업자 데이터를 불러오는데 실패했습니다.');
      }
      const workers = await workersResponse.json();
      
      // 직원 ID가 작업자 관리에 등록되어 있는지 확인
      const isWorkerRegistered = workers.some((worker: any) => worker.companyId === userData.companyId);
      
      if (!isWorkerRegistered) {
        return NextResponse.json({ 
          error: '등록되지 않은 직원 ID', 
          message: '해당 직원 ID는 작업자 관리에 등록되어 있지 않습니다. 먼저 설정의 작업자 관리에서 등록해주세요.' 
        }, { status: 400 });
      }
    }
    
    // 기존 사용자 불러오기
    const users = loadUsers();
    
    // 이메일 중복 검사
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 400 });
    }
    
    // 새 사용자 생성
    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      createdAt: new Date().toISOString(),
      companyId: userData.companyId || '',
    };
    
    // 사용자 추가 및 저장
    users.push(newUser);
    
    // 직원 ID 기준으로 정렬
    users.sort((a, b) => {
      const companyIdA = a.companyId || '';
      const companyIdB = b.companyId || '';
      return companyIdA.localeCompare(companyIdB);
    });
    
    saveUsers(users);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    return NextResponse.json({ error: '사용자 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사용자 정보 업데이트
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.id || !data.name || !data.email || !data.role || !data.department) {
      return NextResponse.json(
        { error: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 사용자 데이터 불러오기
    const users = loadUsers();
    
    // 사용자 찾기
    const userIndex = users.findIndex(user => user.id === data.id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 이메일 중복 검사 (자신의 이메일은 제외)
    const emailExists = users.some(user => 
      user.id !== data.id && user.email.toLowerCase() === data.email.toLowerCase()
    );
    if (emailExists) {
      return NextResponse.json(
        { error: '이미 등록된 이메일 주소입니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 정보 업데이트
    users[userIndex] = {
      ...users[userIndex],
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department
    };
    
    // 데이터 저장
    saveUsers(users);
    
    // 성공 응답
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error('사용자 정보 업데이트 오류:', error);
    return NextResponse.json(
      { error: '사용자 정보 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 데이터 불러오기
    const users = loadUsers();
    
    // 사용자 찾기
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 사용자 삭제
    const deletedUser = users[userIndex];
    const updatedUsers = users.filter(user => user.id !== id);
    
    // 데이터 저장
    saveUsers(updatedUsers);
    
    // 성공 응답
    return NextResponse.json({ message: '사용자가 삭제되었습니다.', user: deletedUser });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    return NextResponse.json(
      { error: '사용자 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 