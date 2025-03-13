import { NextRequest, NextResponse } from 'next/server';

// Worker 인터페이스 정의
interface Worker {
  id: string;
  name: string;
  companyId: string; // 직원 ID로 사용되지만 필드명은 그대로 유지
  email: string;
  department: string;
  role: string;
}

// 임시 데이터 저장소 (실제로는 데이터베이스에 저장해야 함)
let priorities = [
  { id: 'priority-1', name: '낮음', value: 'LOW', color: 'gray' },
  { id: 'priority-2', name: '중간', value: 'MEDIUM', color: 'blue' },
  { id: 'priority-3', name: '높음', value: 'HIGH', color: 'orange' },
  { id: 'priority-4', name: '긴급', value: 'CRITICAL', color: 'red' },
];

let departments = [
  { id: 'dept-1', name: '생산', value: '생산' },
  { id: 'dept-2', name: '품질', value: '품질' },
  { id: 'dept-3', name: '유지보수', value: '유지보수' },
  { id: 'dept-4', name: '안전', value: '안전' },
  { id: 'dept-5', name: '시스템책임자', value: 'system' },
];

let workers: Worker[] = [
  { id: 'worker-1', name: '김작업자', companyId: 'EMP001', email: 'worker1@example.com', department: '생산', role: 'WORKER' },
  { id: 'worker-2', name: '이엔지니어', companyId: 'EMP002', email: 'worker2@example.com', department: '품질', role: 'WORKER' },
  { id: 'worker-3', name: '박기술자', companyId: 'EMP003', email: 'worker3@example.com', department: '유지보수', role: 'WORKER' },
  { id: 'worker-4', name: 'Thomas cha', companyId: 'EMP004', email: 'worker4@example.com', department: '안전', role: 'MANAGER' },
  { id: 'worker-5', name: '정감독관', companyId: 'EMP005', email: 'worker5@example.com', department: '생산', role: 'MANAGER' },
  { id: 'worker-6', name: 'Thomas cha', companyId: 'EMP0001', email: 'thomas@coilmaster.com', department: 'system', role: 'MANAGER' },
  { id: 'worker-7', name: 'Toy', companyId: 'EMP0002', email: 'toy@toy.com', department: '생산', role: 'MANAGER' },
  { id: 'worker-8', name: 'Sam', companyId: 'EMP0003', email: 'sam@sam.com', department: '생산', role: 'MANAGER' },
];

let issueTypes = [
  { id: 'issuetype-1', name: '설비 문제', value: 'EQUIPMENT', description: '기계 및 설비 관련 문제' },
  { id: 'issuetype-2', name: '원자재 문제', value: 'MATERIAL', description: '원자재 품질 또는 공급 관련 문제' },
  { id: 'issuetype-3', name: '작업자 문제', value: 'WORKER', description: '작업자 실수 또는 교육 관련 문제' },
  { id: 'issuetype-4', name: '지그 문제', value: 'JIG', description: '지그 또는 공구 관련 문제' },
];

// 설정 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'priorities') {
      return NextResponse.json(priorities);
    } else if (type === 'departments') {
      return NextResponse.json(departments);
    } else if (type === 'workers') {
      return NextResponse.json(workers);
    } else if (type === 'issueTypes') {
      return NextResponse.json(issueTypes);
    } else {
      // 모든 설정 데이터 반환
      return NextResponse.json({
        priorities,
        departments,
        workers,
        issueTypes
      });
    }
  } catch (error) {
    console.error('설정 데이터 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '설정 데이터 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 설정 데이터 업데이트
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, items } = data;
    
    if (!type || !items) {
      return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }
    
    if (type === 'priorities') {
      priorities = items;
      return NextResponse.json({ success: true, priorities });
    } else if (type === 'departments') {
      departments = items;
      return NextResponse.json({ success: true, departments });
    } else if (type === 'workers') {
      workers = items;
      return NextResponse.json({ success: true, workers });
    } else if (type === 'issueTypes') {
      issueTypes = items;
      return NextResponse.json({ success: true, issueTypes });
    } else {
      return NextResponse.json({ error: '유효하지 않은 설정 타입입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('설정 데이터 업데이트 중 오류 발생:', error);
    return NextResponse.json({ error: '설정 데이터 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 개별 설정 항목 추가
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('받은 데이터:', data);
    
    const { type, item } = data;
    
    if (!type || !item) {
      console.error('유효하지 않은 요청:', { type, item });
      return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }
    
    console.log(`${type} 항목 추가/수정:`, item);
    
    if (type === 'priorities') {
      // ID가 있으면 수정, 없으면 추가
      if (item.id) {
        console.log('기존 우선순위 수정:', item.id);
        priorities = priorities.map(p => p.id === item.id ? item : p);
      } else {
        const newId = `priority-${Date.now()}`;
        const newItem = { ...item, id: newId };
        console.log('새 우선순위 추가:', newItem);
        priorities.push(newItem);
      }
      return NextResponse.json({ success: true, priorities });
    } else if (type === 'departments') {
      if (item.id) {
        departments = departments.map(d => d.id === item.id ? item : d);
      } else {
        const newId = `dept-${Date.now()}`;
        const newItem = { ...item, id: newId };
        departments.push(newItem);
      }
      return NextResponse.json({ success: true, departments });
    } else if (type === 'workers') {
      // 직원 ID 중복 검사
      if (!item.id) {
        // 새 작업자 추가 시
        const isDuplicateId = workers.some(w => w.companyId === item.companyId);
        if (isDuplicateId) {
          return NextResponse.json({ 
            error: '이미 있는 ID입니다', 
            message: '이미 등록된 직원 ID입니다. 다른 ID를 사용해주세요.' 
          }, { status: 400 });
        }
      } else {
        // 기존 작업자 수정 시, 다른 작업자와 ID가 중복되는지 확인
        const existingWorker = workers.find(w => w.id === item.id);
        if (existingWorker && existingWorker.companyId !== item.companyId) {
          const isDuplicateId = workers.some(w => w.companyId === item.companyId && w.id !== item.id);
          if (isDuplicateId) {
            return NextResponse.json({ 
              error: '이미 있는 ID입니다', 
              message: '이미 등록된 직원 ID입니다. 다른 ID를 사용해주세요.' 
            }, { status: 400 });
          }
        }
      }

      if (item.id) {
        workers = workers.map(w => w.id === item.id ? item : w);
      } else {
        const newId = `worker-${Date.now()}`;
        const newItem = { ...item, id: newId };
        workers.push(newItem);
      }

      // 직원 ID 기준으로 정렬
      workers.sort((a, b) => a.companyId.localeCompare(b.companyId));

      return NextResponse.json({ success: true, workers });
    } else if (type === 'issueTypes') {
      if (item.id) {
        issueTypes = issueTypes.map(it => it.id === item.id ? item : it);
      } else {
        const newId = `issuetype-${Date.now()}`;
        const newItem = { ...item, id: newId };
        issueTypes.push(newItem);
      }
      return NextResponse.json({ success: true, issueTypes });
    } else {
      console.error('유효하지 않은 설정 타입:', type);
      return NextResponse.json({ error: '유효하지 않은 설정 타입입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('설정 항목 추가/수정 중 오류 발생:', error);
    return NextResponse.json({ 
      error: '설정 항목 추가/수정 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// 개별 설정 항목 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }
    
    if (type === 'priorities') {
      priorities = priorities.filter(p => p.id !== id);
      return NextResponse.json({ success: true, priorities });
    } else if (type === 'departments') {
      departments = departments.filter(d => d.id !== id);
      return NextResponse.json({ success: true, departments });
    } else if (type === 'workers') {
      workers = workers.filter(w => w.id !== id);
      return NextResponse.json({ success: true, workers });
    } else if (type === 'issueTypes') {
      issueTypes = issueTypes.filter(it => it.id !== id);
      return NextResponse.json({ success: true, issueTypes });
    } else {
      return NextResponse.json({ error: '유효하지 않은 설정 타입입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('설정 항목 삭제 중 오류 발생:', error);
    return NextResponse.json({ error: '설정 항목 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 