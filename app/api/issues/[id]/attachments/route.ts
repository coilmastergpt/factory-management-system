import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');

// 이슈 인터페이스 정의
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  department: string;
  issueType: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
    companyId?: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
    companyId: string;
    department?: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  solution: string | null;
  attachments?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
}

// 이슈 데이터 로드
const loadIssues = (): Issue[] => {
  try {
    if (!fs.existsSync(ISSUES_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(ISSUES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('이슈 데이터 로드 오류:', error);
    return [];
  }
};

// 이슈 데이터 저장
const saveIssues = (issues: Issue[]): void => {
  try {
    // 데이터 디렉토리가 없으면 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(ISSUES_FILE, JSON.stringify(issues, null, 2));
  } catch (error) {
    console.error('이슈 데이터 저장 중 오류 발생:', error);
  }
};

// 첨부 파일 추가 API
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    const { attachments } = await request.json();
    
    if (!attachments || !Array.isArray(attachments)) {
      return NextResponse.json(
        { error: '유효한 첨부 파일 데이터가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 이슈 찾기
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      return NextResponse.json(
        { error: '이슈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 첨부 파일 추가
    if (!issues[issueIndex].attachments) {
      issues[issueIndex].attachments = [];
    }
    
    issues[issueIndex].attachments = [
      ...issues[issueIndex].attachments!,
      ...attachments
    ];
    
    // 업데이트 시간 갱신
    issues[issueIndex].updatedAt = new Date().toISOString();
    
    // 이슈 데이터 저장
    saveIssues(issues);
    
    return NextResponse.json({
      success: true,
      attachments: issues[issueIndex].attachments
    });
  } catch (error) {
    console.error('첨부 파일 추가 오류:', error);
    return NextResponse.json(
      { error: '첨부 파일 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 첨부 파일 삭제 API
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueId = params.id;
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('fileUrl');
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: '삭제할 파일 URL이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 이슈 데이터 로드
    const issues = loadIssues();
    
    // 이슈 찾기
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      return NextResponse.json(
        { error: '이슈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 첨부 파일이 없는 경우
    if (!issues[issueIndex].attachments || issues[issueIndex].attachments.length === 0) {
      return NextResponse.json(
        { error: '이슈에 첨부 파일이 없습니다.' },
        { status: 404 }
      );
    }
    
    // 첨부 파일 삭제
    const attachmentIndex = issues[issueIndex].attachments!.findIndex(
      attachment => attachment.url === fileUrl
    );
    
    if (attachmentIndex === -1) {
      return NextResponse.json(
        { error: '해당 첨부 파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 파일 시스템에서 파일 삭제 (선택적)
    try {
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error('파일 삭제 오류:', fileError);
      // 파일 삭제 실패해도 계속 진행
    }
    
    // 첨부 파일 배열에서 제거
    issues[issueIndex].attachments!.splice(attachmentIndex, 1);
    
    // 업데이트 시간 갱신
    issues[issueIndex].updatedAt = new Date().toISOString();
    
    // 이슈 데이터 저장
    saveIssues(issues);
    
    return NextResponse.json({
      success: true,
      attachments: issues[issueIndex].attachments
    });
  } catch (error) {
    console.error('첨부 파일 삭제 오류:', error);
    return NextResponse.json(
      { error: '첨부 파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 