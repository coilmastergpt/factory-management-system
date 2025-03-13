import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 파일 형식 검사
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: '지원하지 않는 파일 형식입니다. 이미지 또는 동영상만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }
    
    // 파일 크기 제한 (이미지: 10MB, 동영상: 100MB)
    const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: `파일 크기가 너무 큽니다. ${file.type.startsWith('image/') ? '이미지는 10MB' : '동영상은 100MB'} 이하여야 합니다.` 
        },
        { status: 400 }
      );
    }
    
    // 파일 확장자 추출
    const originalName = file.name;
    const fileExt = originalName.split('.').pop() || '';
    
    // 고유한 파일명 생성
    const uniqueFilename = `${uuidv4()}.${fileExt}`;
    
    // 파일 저장 경로 결정
    const folderPath = file.type.startsWith('image/') ? 'images' : 'videos';
    const uploadDir = join(process.cwd(), 'public', 'uploads', folderPath);
    const filePath = join(uploadDir, uniqueFilename);
    
    // 파일 데이터를 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 파일 저장
    await writeFile(filePath, buffer);
    
    // 클라이언트에서 접근 가능한 URL 생성
    const fileUrl = `/uploads/${folderPath}/${uniqueFilename}`;
    
    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        name: originalName,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { success: false, error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 최대 파일 크기 설정 (100MB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
}; 