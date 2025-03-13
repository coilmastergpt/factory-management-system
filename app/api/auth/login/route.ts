import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 사용자 데이터를 JSON 파일에서 읽어오는 함수
function getUsersData() {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const users = getUsersData();

    // 사용자 이름으로 사용자 찾기
    const user = users.find((u: any) => 
      u.name.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    if (password !== user.password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 필드 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({ user: userWithoutPassword });
    response.cookies.set('user', JSON.stringify(userWithoutPassword), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('user');
  return response;
} 