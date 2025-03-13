import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 사용자 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  department: string;
  companyId?: string;
  createdAt: string;
}

// 데이터 파일 경로
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// 사용자 데이터 불러오기
const loadUsers = (): User[] => {
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
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(users, null, 2));
};

// 특정 사용자 정보 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const users = loadUsers();
    
    const user = users.find(user => user.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return NextResponse.json(
      { error: '사용자 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자 정보 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
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
      const worker = workers.find((worker: any) => worker.companyId === userData.companyId);
      
      if (!worker) {
        return NextResponse.json({ 
          error: '등록되지 않은 직원 ID', 
          message: '해당 직원 ID는 작업자 관리에 등록되어 있지 않습니다. 먼저 설정의 작업자 관리에서 등록해주세요.' 
        }, { status: 400 });
      }
      
      // 이름과 직원 ID가 일치하는지 확인
      if (worker.name !== userData.name) {
        return NextResponse.json({ 
          error: '이름과 직원 ID 불일치', 
          message: '입력한 이름과 직원 ID가 작업자 관리에 등록된 정보와 일치하지 않습니다.' 
        }, { status: 400 });
      }
    }
    
    // 사용자 데이터 불러오기
    const users = loadUsers();
    
    // 사용자 찾기
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 이메일 중복 검사 (자신의 이메일은 제외)
    const emailExists = users.some(
      user => user.email === userData.email && user.id !== userId
    );
    if (emailExists) {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 400 });
    }
    
    // 사용자 정보 업데이트
    const updatedUser = {
      ...users[userIndex],
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      companyId: userData.companyId || users[userIndex].companyId,
      // 비밀번호는 기존 값 유지
      password: users[userIndex].password
    };
    
    users[userIndex] = updatedUser;
    
    // 직원 ID 기준으로 정렬
    users.sort((a, b) => {
      const companyIdA = a.companyId || '';
      const companyIdB = b.companyId || '';
      return companyIdA.localeCompare(companyIdB);
    });
    
    // 변경사항 저장
    saveUsers(users);
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('사용자 업데이트 오류:', error);
    return NextResponse.json({ error: '사용자 정보 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사용자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // 사용자 데이터 불러오기
    const users = loadUsers();
    
    // 사용자 찾기
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 사용자 삭제
    const deletedUser = users[userIndex];
    const updatedUsers = users.filter(user => user.id !== userId);
    
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