import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 모의 사용자 데이터베이스 참조
let users = [];

// 사용자 데이터 가져오기
const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    if (!response.ok) {
      throw new Error('사용자 목록을 가져오는데 실패했습니다.');
    }
    users = await response.json();
    return users;
  } catch (error) {
    console.error('사용자 목록 가져오기 오류:', error);
    return [];
  }
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 현재 로그인한 사용자 정보 확인
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      );
    }
    
    const currentUser = JSON.parse(decodeURIComponent(userCookie.value));
    
    // 관리자만 승격 가능
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '권한이 없습니다. 관리자만 사용자를 승격할 수 있습니다.' },
        { status: 403 }
      );
    }
    
    const userId = params.id;
    const { role } = await request.json();
    
    // 역할이 MANAGER인 경우만 처리
    if (role !== 'MANAGER') {
      return NextResponse.json(
        { error: '잘못된 역할입니다. 매니저로만 승격할 수 있습니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 목록 가져오기
    await fetchUsers();
    
    // 사용자 존재 여부 확인
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const user = users[userIndex];
    
    // 이미 매니저인 경우
    if (user.role === 'MANAGER') {
      return NextResponse.json(
        { error: '이미 매니저 역할을 가진 사용자입니다.' },
        { status: 400 }
      );
    }
    
    // 관리자는 변경 불가
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: '관리자의 역할은 변경할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 역할 업데이트
    const updatedUser = { ...user, role: 'MANAGER' };
    
    // 사용자 API에 업데이트 요청
    const updateResponse = await fetch('http://localhost:3000/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });
    
    if (!updateResponse.ok) {
      throw new Error('사용자 업데이트에 실패했습니다.');
    }
    
    const result = await updateResponse.json();
    
    return NextResponse.json({
      message: '사용자가 매니저로 승격되었습니다.',
      user: result,
    });
  } catch (error) {
    console.error('매니저 승격 오류:', error);
    return NextResponse.json(
      { error: '매니저 승격 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 