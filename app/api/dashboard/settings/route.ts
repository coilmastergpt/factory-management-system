import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

interface DashboardSettings {
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  widgets: {
    [key: string]: {
      visible: boolean;
    };
  };
}

const DEFAULT_SETTINGS: DashboardSettings = {
  layout: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 1 },
    { i: 'statusChart', x: 0, y: 1, w: 4, h: 2 },
    { i: 'priorityChart', x: 4, y: 1, w: 4, h: 2 },
    { i: 'trendChart', x: 8, y: 1, w: 4, h: 2 },
    { i: 'departmentStats', x: 0, y: 3, w: 6, h: 2 },
    { i: 'recentResolved', x: 6, y: 3, w: 6, h: 2 },
    { i: 'issuesByCreator', x: 0, y: 5, w: 4, h: 2 },
    { i: 'issuesBySolver', x: 4, y: 5, w: 4, h: 2 },
    { i: 'resolutionTimeByDepartment', x: 8, y: 5, w: 4, h: 2 }
  ],
  widgets: {
    stats: { visible: true },
    statusChart: { visible: true },
    priorityChart: { visible: true },
    trendChart: { visible: true },
    departmentStats: { visible: true },
    recentResolved: { visible: true },
    issuesByCreator: { visible: true },
    issuesBySolver: { visible: true },
    resolutionTimeByDepartment: { visible: true }
  },
};

// 대시보드 설정 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 임시 대시보드 설정 데이터
    const dashboardSettings = {
      layout: [
        { i: 'stats', x: 0, y: 0, w: 12, h: 1 },
        { i: 'statusChart', x: 0, y: 1, w: 4, h: 2 },
        { i: 'priorityChart', x: 4, y: 1, w: 4, h: 2 },
        { i: 'trendChart', x: 8, y: 1, w: 4, h: 2 },
        { i: 'departmentStats', x: 0, y: 3, w: 6, h: 2 },
        { i: 'recentResolved', x: 6, y: 3, w: 6, h: 2 },
        { i: 'issuesByCreator', x: 0, y: 5, w: 4, h: 2 },
        { i: 'issuesBySolver', x: 4, y: 5, w: 4, h: 2 },
        { i: 'resolutionTimeByDepartment', x: 8, y: 5, w: 4, h: 2 }
      ],
      widgets: {
        stats: { visible: true },
        statusChart: { visible: true },
        priorityChart: { visible: true },
        trendChart: { visible: true },
        departmentStats: { visible: true },
        recentResolved: { visible: true },
        issuesByCreator: { visible: true },
        issuesBySolver: { visible: true },
        resolutionTimeByDepartment: { visible: true }
      }
    };

    return NextResponse.json(dashboardSettings);
  } catch (error) {
    console.error('대시보드 설정 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드 설정 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 대시보드 설정 저장
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.layout || !data.widgets) {
      return NextResponse.json({ error: '레이아웃과 위젯 설정은 필수입니다.' }, { status: 400 });
    }

    // 임시 응답 (실제 DB 연동 전)
    return NextResponse.json({
      success: true,
      message: '대시보드 설정이 저장되었습니다.'
    });
  } catch (error) {
    console.error('대시보드 설정 저장 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드 설정 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 