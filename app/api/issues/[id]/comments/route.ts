import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 사용자 데이터를 JSON 파일에서 읽어오는 함수
function getUsersData() {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// 이슈 데이터를 JSON 파일에서 읽어오는 함수
function getIssuesData() {
  const filePath = path.join(process.cwd(), 'data', 'issues.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// 댓글 데이터를 저장할 파일 경로
const commentsFilePath = path.join(process.cwd(), 'data', 'comments.json');

// 댓글 데이터를 읽어오는 함수
function getCommentsData() {
  try {
    if (fs.existsSync(commentsFilePath)) {
      const fileContents = fs.readFileSync(commentsFilePath, 'utf8');
      return JSON.parse(fileContents);
    }
    return [];
  } catch (error) {
    console.error('댓글 데이터 읽기 오류:', error);
    return [];
  }
}

// 댓글 데이터를 저장하는 함수
function saveCommentsData(comments: any[]) {
  try {
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8');
  } catch (error) {
    console.error('댓글 데이터 저장 오류:', error);
  }
}

// 현재 로그인한 사용자 정보 가져오기
function getCurrentUser(request: NextRequest) {
  const cookies = request.cookies;
  const userCookie = cookies.get('user');
  
  if (!userCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error('사용자 쿠키 파싱 오류:', error);
    return null;
  }
}

// 특정 이슈의 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const issueId = params.id;
    const issues = getIssuesData();
    
    // 이슈 존재 여부 확인
    const issue = issues.find((issue: any) => issue.id === issueId);
    if (!issue) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 해당 이슈의 댓글만 필터링
    const allComments = getCommentsData();
    const issueComments = allComments.filter((comment: any) => comment.issueId === issueId);
    
    return NextResponse.json(issueComments);
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
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const issueId = params.id;
    const data = await request.json();

    // 필수 필드 검증
    if (!data.content) {
      return NextResponse.json({ error: '댓글 내용은 필수입니다.' }, { status: 400 });
    }

    const issues = getIssuesData();
    
    // 이슈 존재 여부 확인
    const issue = issues.find((issue: any) => issue.id === issueId);
    if (!issue) {
      return NextResponse.json({ error: '이슈를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 새 댓글 생성
    const newComment = {
      id: uuidv4(),
      issueId: issueId,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

    // 댓글 저장
    const comments = getCommentsData();
    comments.push(newComment);
    saveCommentsData(comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('댓글 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '댓글 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 