// 이슈 관련 API
export const fetchIssues = async () => {
  const response = await fetch('/api/issues');
  if (!response.ok) {
    throw new Error('이슈 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

export const createIssue = async (issueData: any) => {
  const response = await fetch('/api/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issueData),
  });
  if (!response.ok) {
    throw new Error('이슈 생성에 실패했습니다.');
  }
  return response.json();
};

// 사용자 관련 API
export const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('사용자 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

export const createUser = async (userData: any) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('사용자 생성에 실패했습니다.');
  }
  return response.json();
}; 