import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    // 임시 대시보드 데이터 생성
    const dashboardData = {
      totalIssues: 120,
      resolvedIssues: 85,
      criticalIssues: 12,
      statusStats: [
        { status: 'OPEN', _count: 35 },
        { status: 'IN_PROGRESS', _count: 28 },
        { status: 'RESOLVED', _count: 42 },
        { status: 'CLOSED', _count: 15 }
      ],
      priorityStats: [
        { priority: 'LOW', _count: 25 },
        { priority: 'MEDIUM', _count: 45 },
        { priority: 'HIGH', _count: 38 },
        { priority: 'CRITICAL', _count: 12 }
      ],
      departmentStats: [
        { category: '생산', total_count: 45, resolved_count: 32, resolution_rate: 71.1 },
        { category: '품질', total_count: 38, resolved_count: 30, resolution_rate: 78.9 },
        { category: '유지보수', total_count: 25, resolved_count: 18, resolution_rate: 72.0 },
        { category: '안전', total_count: 12, resolved_count: 5, resolution_rate: 41.7 }
      ],
      dailyIssues: Array.from({ length: 14 }, (_, i) => ({
        createdAt: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        _count: Math.floor(Math.random() * 10) + 1
      })),
      recentResolved: Array.from({ length: 5 }, (_, i) => ({
        id: `issue-${i + 1}`,
        title: `최근 해결된 이슈 ${i + 1}`,
        resolvedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
        solver: {
          name: `해결사 ${i + 1}`,
          department: ['생산', '품질', '유지보수', '안전'][Math.floor(Math.random() * 4)]
        }
      })),
      avgResolutionTime: 18.5,
      weeklyChange: 12.3
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('대시보드 데이터 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드 데이터 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 