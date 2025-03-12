import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

// 특정 이슈의 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const issueId = params.id;

    // 이슈 존재 여부 확인
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    });

    if (!issue) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 임시 댓글 데이터 반환 (실제 DB 연동 전)
    const mockComments = [
      {
        id: '1',
        content: '이 이슈는 빠른 해결이 필요합니다.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          id: 'user1',
          name: '김관리자',
          email: 'admin@example.com'
        }
      },
      {
        id: '2',
        content: '담당자 배정이 필요합니다.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          id: 'user2',
          name: '이엔지니어',
          email: 'engineer@example.com'
        }
      }
    ];

    return NextResponse.json(mockComments);
  } catch (error) {
    console.error('댓글 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '댓글 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 새 댓글 생성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const issueId = params.id;
    const data = await request.json();

    // 필수 필드 검증
    if (!data.content) {
      return NextResponse.json({ error: '댓글 내용은 필수입니다.' }, { status: 400 });
    }

    // 이슈 존재 여부 확인
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    });

    if (!issue) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 임시 댓글 생성 응답 (실제 DB 연동 전)
    const mockComment = {
      id: `comment-${Date.now()}`,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: 'current-user',
        name: '현재 사용자',
        email: session.user.email || 'user@example.com'
      }
    };

    return NextResponse.json(mockComment, { status: 201 });
  } catch (error) {
    console.error('댓글 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '댓글 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 