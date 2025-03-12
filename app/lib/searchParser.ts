interface SearchCondition {
  field: string;
  operator: string;
  value: string;
}

interface ParsedSearch {
  textSearch?: string;
  conditions: SearchCondition[];
}

const OPERATORS = [':', '>', '<', '>=', '<=', '!='];

export function parseSearchQuery(query: string): ParsedSearch {
  const conditions: SearchCondition[] = [];
  let textSearch = '';

  // 따옴표로 묶인 문자열 처리
  const quotedRegex = /"([^"]+)"/g;
  const quotedMatches = query.match(quotedRegex) || [];
  let remainingQuery = query;

  quotedMatches.forEach((match, index) => {
    remainingQuery = remainingQuery.replace(match, `__QUOTED_${index}__`);
  });

  // 필드 조건 파싱
  const tokens = remainingQuery.split(' ').filter(Boolean);

  tokens.forEach(token => {
    // 따옴표로 묶인 문자열 복원
    if (token.startsWith('__QUOTED_')) {
      const index = parseInt(token.replace('__QUOTED_', '').replace('__', ''));
      const originalText = quotedMatches[index].replace(/"/g, '');
      textSearch += ' ' + originalText;
      return;
    }

    // 필드 조건 파싱
    const operator = OPERATORS.find(op => token.includes(op));
    if (operator) {
      const [field, value] = token.split(operator);
      conditions.push({
        field,
        operator,
        value,
      });
    } else {
      textSearch += ' ' + token;
    }
  });

  return {
    textSearch: textSearch.trim() || undefined,
    conditions,
  };
}

export function buildPrismaQuery(parsed: ParsedSearch) {
  const where: any = {};

  if (parsed.textSearch) {
    where.OR = [
      { title: { contains: parsed.textSearch, mode: 'insensitive' } },
      { description: { contains: parsed.textSearch, mode: 'insensitive' } },
    ];
  }

  parsed.conditions.forEach(condition => {
    const value = condition.value;
    
    switch (condition.operator) {
      case ':':
        where[condition.field] = value;
        break;
      case '>':
        where[condition.field] = { gt: value };
        break;
      case '<':
        where[condition.field] = { lt: value };
        break;
      case '>=':
        where[condition.field] = { gte: value };
        break;
      case '<=':
        where[condition.field] = { lte: value };
        break;
      case '!=':
        where[condition.field] = { not: value };
        break;
    }
  });

  return where;
}

export const SEARCH_HELP = `
고급 검색 구문 사용법:

1. 기본 검색
   - 일반 텍스트 입력: 제목과 설명에서 검색
   - 예: "네트워크 오류"

2. 필드 검색
   - field:value 형식
   - 예: status:OPEN priority:HIGH

3. 비교 연산자
   - >, <, >=, <=, != 지원
   - 예: priority:HIGH createdAt>2024-01-01

4. 복합 검색
   - 여러 조건을 공백으로 구분
   - 예: status:OPEN priority:HIGH "네트워크 오류"

5. 지원되는 필드
   - status: 상태 (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
   - priority: 우선순위 (LOW, MEDIUM, HIGH, CRITICAL)
   - category: 부서
   - location: 위치
   - createdAt: 생성일
   - resolvedAt: 해결일
`.trim(); 