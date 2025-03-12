import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// 대시보드 설정 조회
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dashboardSettings: true },
    });

    return NextResponse.json(user?.dashboardSettings || {
      layout: [
        { i: 'stats', x: 0, y: 0, w: 12, h: 1 },
        { i: 'departmentStats', x: 0, y: 1, w: 6, h: 2 },
        { i: 'recentResolved', x: 6, y: 1, w: 6, h: 2 },
      ],
      widgets: {
        stats: { visible: true },
        departmentStats: { visible: true },
        recentResolved: { visible: true },
      },
    });
  } catch (error) {
    console.error('대시보드 설정 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '대시보드 설정을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 대시보드 설정 저장
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const settings = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: { dashboardSettings: settings },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('대시보드 설정 저장 중 오류 발생:', error);
    return NextResponse.json(
      { error: '대시보드 설정 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
} 