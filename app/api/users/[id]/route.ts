import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 사용자 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  companyId: string;
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
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.name || !data.email || !data.role || !data.department) {
      return NextResponse.json(
        { error: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
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
    
    // 이메일 중복 검사 (자신의 이메일은 제외)
    const emailExists = users.some(user => 
      user.id !== userId && user.email.toLowerCase() === data.email.toLowerCase()
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
      department: data.department,
      companyId: data.companyId || users[userIndex].companyId
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