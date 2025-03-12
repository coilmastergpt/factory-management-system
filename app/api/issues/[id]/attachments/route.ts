import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 저장 로직 (임시로 URL만 저장)
    const attachment = await prisma.issueAttachment.create({
      data: {
        filename: file.name,
        url: `/uploads/${file.name}`, // 실제로는 클라우드 스토리지 URL이 들어갈 것입니다
        issueId: params.id,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    return NextResponse.json(
      { error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const attachments = await prisma.issueAttachment.findMany({
      where: {
        issueId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error('첨부 파일 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '첨부 파일 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 