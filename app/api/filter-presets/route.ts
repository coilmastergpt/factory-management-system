import { NextRequest, NextResponse } from 'next/server';

// 필터 프리셋 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 임시 프리셋 데이터 생성
    const mockPresets = [
      {
        id: 'preset-1',
        name: '해결되지 않은 이슈',
        filter: {
          status: 'OPEN'
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'preset-2',
        name: '긴급 이슈',
        filter: {
          priority: 'CRITICAL'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'preset-3',
        name: '생산부 이슈',
        filter: {
          department: '생산'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return NextResponse.json(mockPresets);
  } catch (error) {
    console.error('필터 프리셋 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '필터 프리셋 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 새 필터 프리셋 생성
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.name) {
      return NextResponse.json({ error: '프리셋 이름은 필수입니다.' }, { status: 400 });
    }
    
    // 임시로 생성된 프리셋 반환
    return NextResponse.json({
      id: 'preset-' + Date.now(),
      name: data.name,
      filter: data.filter || {},
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('필터 프리셋 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '필터 프리셋 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 