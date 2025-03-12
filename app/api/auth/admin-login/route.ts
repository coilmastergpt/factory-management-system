import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 관리자 사용자 정보 생성
    const adminUser = {
      id: 'admin-1',
      name: '관리자',
      email: 'admin@example.com',
      role: 'ADMIN',
      department: '시스템관리',
    };
    
    // 쿠키에 관리자 정보 저장
    const response = NextResponse.json({ 
      success: true,
      message: '관리자로 로그인되었습니다.',
      user: adminUser 
    });
    
    // 쿠키 설정 방식 변경
    response.cookies.set({
      name: 'user',
      value: JSON.stringify(adminUser),
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('관리자 로그인 오류:', error);
    return NextResponse.json(
      { error: '관리자 로그인에 실패했습니다.' },
      { status: 500 }
    );
  }
} 