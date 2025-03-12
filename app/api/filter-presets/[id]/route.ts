import { NextRequest, NextResponse } from 'next/server';

// 필터 프리셋 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 임시로 성공 응답 반환
    return NextResponse.json({
      id: params.id,
      name: '샘플 프리셋',
      filter: {
        status: 'OPEN',
        priority: 'HIGH'
      },
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('필터 프리셋 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '필터 프리셋 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 필터 프리셋 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.name) {
      return NextResponse.json({ error: '프리셋 이름은 필수입니다.' }, { status: 400 });
    }
    
    // 임시로 업데이트된 프리셋 반환
    return NextResponse.json({
      id: params.id,
      name: data.name,
      filter: data.filter || {},
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('필터 프리셋 업데이트 중 오류 발생:', error);
    return NextResponse.json({ error: '필터 프리셋 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 필터 프리셋 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const presetId = params.id;
    
    // 실제 구현에서는 DB에서 삭제 작업 수행
    // 여기서는 성공 응답만 반환
    
    return NextResponse.json({ success: true, message: '필터 프리셋이 삭제되었습니다.' });
  } catch (error) {
    console.error('필터 프리셋 삭제 중 오류 발생:', error);
    return NextResponse.json({ error: '필터 프리셋 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 