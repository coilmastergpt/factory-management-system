'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  InputGroup,
  InputLeftElement,
  Flex,
  Spacer,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, TriangleDownIcon, TriangleUpIcon, DownloadIcon } from '@chakra-ui/icons';
import CreateUserForm from '../components/CreateUserForm';
import { fetchUsers } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const roleColors = {
  ADMIN: 'red',
  MANAGER: 'green',
  WORKER: 'blue',
} as const;

interface User {
  id: string;
  name: string;
  email: string;
  role: keyof typeof roleColors;
  department: string;
  companyId: string;
  createdAt: string;
}

interface Department {
  id: string;
  name: string;
  value: string;
}

export default function UsersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // 매니저 승격 관련 상태
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 사용자 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // 사용자 삭제 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string>('');
  const [userNameToDelete, setUserNameToDelete] = useState<string>('');
  const deleteConfirmRef = useRef<HTMLButtonElement>(null);

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // 정렬 관련 상태
  type SortField = 'name' | 'email' | 'role' | 'department' | 'companyId' | 'createdAt';
  type SortDirection = 'asc' | 'desc';
  
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [departments, setDepartments] = useState<Department[]>([]);

  // 권한 체크: 관리자만 접근 가능
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'ADMIN') {
        toast({
          title: '접근 권한 없음',
          description: '관리자 관리 페이지는 관리자만 접근할 수 있습니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      }
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, toast]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast({
        title: '사용자 목록을 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/settings?type=departments');
      if (!response.ok) {
        throw new Error('부서 목록을 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      console.log('부서 데이터:', data); // 디버깅용 로그
      
      // API 응답 구조에 따라 departments 배열 추출
      if (Array.isArray(data)) {
        setDepartments(data);
      } else if (data.departments) {
        setDepartments(data.departments);
      } else {
        throw new Error('부서 데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('부서 목록 가져오기 오류:', error);
      // 오류 발생 시 기본 부서 목록 설정
      setDepartments([
        { id: 'dept-1', name: '생산', value: '생산' },
        { id: 'dept-2', name: '품질', value: '품질' },
        { id: 'dept-3', name: '유지보수', value: '유지보수' },
        { id: 'dept-4', name: '안전', value: '안전' },
      ]);
      toast({
        title: '부서 목록을 불러오는데 실패했습니다.',
        description: '기본 부서 목록을 사용합니다.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadUsers();
    fetchDepartments();
  }, []);

  // 검색어에 따라 사용자 필터링
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.department.toLowerCase().includes(lowercasedSearch) ||
          (user.role === 'ADMIN' && '관리자'.includes(lowercasedSearch)) ||
          (user.role === 'MANAGER' && '매니저'.includes(lowercasedSearch)) ||
          (user.role === 'WORKER' && '일반 사용자'.includes(lowercasedSearch))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleUserCreated = () => {
    loadUsers();
    onClose();
  };
  
  // 매니저 승격 다이얼로그 열기
  const openPromoteDialog = (user: User) => {
    setSelectedUser(user);
    setIsPromoteDialogOpen(true);
  };
  
  // 매니저 승격 처리
  const handlePromoteToManager = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/promote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'MANAGER' }),
      });
      
      if (!response.ok) {
        throw new Error('매니저 승격에 실패했습니다.');
      }
      
      toast({
        title: '매니저 승격 완료',
        description: `${selectedUser.name}님이 매니저로 승격되었습니다.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 사용자 목록 새로고침
      loadUsers();
    } catch (error) {
      toast({
        title: '매니저 승격 실패',
        description: '매니저 승격 처리 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsPromoteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // 사용자 삭제 처리
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('관리자 삭제에 실패했습니다.');
      }
      
      toast({
        title: '관리자가 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 사용자 목록 새로고침
      loadUsers();
      // 모달 닫기
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('관리자 삭제 오류:', error);
      toast({
        title: '관리자 삭제 실패',
        description: '관리자를 삭제하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 삭제 확인 모달 열기
  const openDeleteConfirmModal = (userId: string, userName: string) => {
    setUserToDelete(userId);
    setUserNameToDelete(userName);
    setIsDeleteModalOpen(true);
  };

  // 사용자 수정 모달 열기
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // 사용자 수정 처리
  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      setIsEditSubmitting(true);
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error('관리자 정보 수정에 실패했습니다.');
      }

      toast({
        title: '관리자 정보가 수정되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 사용자 목록 다시 불러오기
      loadUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('관리자 수정 오류:', error);
      toast({
        title: '관리자 정보 수정 실패',
        description: '관리자 정보를 수정하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 같은 필드를 다시 클릭하면 정렬 방향 전환
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 오름차순 정렬
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬된 사용자 목록 계산
  const getSortedUsers = () => {
    return [...filteredUsers].sort((a, b) => {
      let valueA, valueB;
      
      // 필드에 따라 비교할 값 설정
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'role':
          valueA = a.role;
          valueB = b.role;
          break;
        case 'department':
          valueA = a.department.toLowerCase();
          valueB = b.department.toLowerCase();
          break;
        case 'companyId':
          valueA = a.companyId.toLowerCase();
          valueB = b.companyId.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      // 정렬 방향에 따라 비교
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // 정렬된 사용자 목록
  const sortedUsers = getSortedUsers();
  
  // 현재 페이지에 표시할 사용자 계산
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <TriangleUpIcon ml={1} boxSize={3} /> 
      : <TriangleDownIcon ml={1} boxSize={3} />;
  };

  // 엑셀 내보내기 함수
  const exportToExcel = () => {
    // CSV 형식으로 데이터 생성
    const headers = ['이름', '이메일', '역할', '부서', '등록일'];
    
    const roleMap = {
      ADMIN: '관리자',
      MANAGER: '매니저',
      WORKER: '일반 사용자'
    };
    
    const csvData = filteredUsers.map(user => [
      user.name,
      user.email,
      roleMap[user.role],
      user.department,
      new Date(user.createdAt).toLocaleDateString()
    ]);
    
    // 헤더와 데이터 합치기
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // CSV 파일 생성 및 다운로드
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `사용자_목록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: '엑셀 내보내기 완료',
      description: '사용자 목록이 CSV 파일로 저장되었습니다.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // 로딩 중이거나 권한이 없는 경우 표시
  if (authLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>접근 권한 없음</AlertTitle>
          <AlertDescription>관리자 관리 페이지는 관리자만 접근할 수 있습니다.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">관리자 관리</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          새 관리자 등록
        </Button>
      </HStack>

      <Flex align="center" mb={6}>
        <InputGroup maxW="300px" mr={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="이름, 이메일, 부서 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box overflowX="auto" bg="white" borderRadius="lg" shadow="md">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th onClick={() => handleSort('name')} cursor="pointer">
                이름 {sortField === 'name' && (sortDirection === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />)}
              </Th>
              <Th onClick={() => handleSort('companyId')} cursor="pointer">
                직원 ID {sortField === 'companyId' && (sortDirection === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />)}
              </Th>
              <Th onClick={() => handleSort('email')} cursor="pointer">
                이메일 {sortField === 'email' && (sortDirection === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />)}
              </Th>
              <Th onClick={() => handleSort('department')} cursor="pointer">
                부서 {sortField === 'department' && (sortDirection === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />)}
              </Th>
              <Th>관리자 유형</Th>
              <Th>작업</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.length > 0 ? (
              currentUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.companyId}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.department}</Td>
                  <Td>
                    <Badge colorScheme={roleColors[user.role]}>
                      {user.role === 'ADMIN' ? '관리자' : 
                      user.role === 'MANAGER' ? '매니저' : '일반 사용자'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button 
                        size="sm" 
                        colorScheme="blue"
                        onClick={() => openEditModal(user)}
                      >
                        수정
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red"
                        onClick={() => openDeleteConfirmModal(user.id, user.name)}
                      >
                        삭제
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center" py={4}>
                  <Text>검색 결과가 없습니다.</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        
        {/* 페이지네이션 컨트롤 */}
        {filteredUsers.length > 0 && (
          <Flex justify="center" p={4}>
            <Stack direction="row" spacing={2}>
              <Button
                size="sm"
                onClick={() => handlePageChange(1)}
                isDisabled={currentPage === 1}
              >
                처음
              </Button>
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
              >
                이전
              </Button>
              
              {/* 페이지 번호 버튼 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => {
                  // 페이지 번호 사이에 ... 표시
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <Button size="sm" variant="ghost" isDisabled>
                          ...
                        </Button>
                        <Button
                          size="sm"
                          colorScheme={currentPage === page ? "blue" : "gray"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      size="sm"
                      colorScheme={currentPage === page ? "blue" : "gray"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
              >
                다음
              </Button>
              <Button
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                isDisabled={currentPage === totalPages}
              >
                마지막
              </Button>
            </Stack>
          </Flex>
        )}
      </Box>

      {/* 새 사용자 등록 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 사용자 등록</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CreateUserForm onSuccess={handleUserCreated} />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* 사용자 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>관리자 정보 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editingUser && (
              <Box as="form" p={6} bg="white" borderRadius="lg" shadow="md">
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>이름</FormLabel>
                    <Input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      placeholder="사용자 이름"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>이메일</FormLabel>
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      placeholder="example@factory.com"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>역할</FormLabel>
                    <Select 
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value as keyof typeof roleColors})}
                    >
                      <option value="WORKER">일반 사용자</option>
                      <option value="MANAGER">매니저</option>
                      <option value="ADMIN">관리자</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>부서</FormLabel>
                    <Select
                      value={editingUser.department}
                      onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                      placeholder="부서 선택"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.value}>
                          {dept.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>직원 ID</FormLabel>
                    <Input
                      value={editingUser.companyId}
                      onChange={(e) => setEditingUser({...editingUser, companyId: e.target.value})}
                      placeholder="직원 ID (예: EMP001)"
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={handleEditUser}
                    isLoading={isEditSubmitting}
                  >
                    저장
                  </Button>
                </VStack>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* 매니저 승격 확인 다이얼로그 */}
      <AlertDialog
        isOpen={isPromoteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsPromoteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              매니저 승격 확인
            </AlertDialogHeader>

            <AlertDialogBody>
              {selectedUser?.name}님을 매니저로 승격하시겠습니까? 
              매니저는 설정 페이지에 접근할 수 있는 권한을 갖게 됩니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsPromoteDialogOpen(false)}>
                취소
              </Button>
              <Button colorScheme="green" onClick={handlePromoteToManager} ml={3}>
                승격
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* 사용자 삭제 확인 모달 */}
      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={deleteConfirmRef}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              관리자 삭제 확인
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                정말로 <strong>{userNameToDelete}</strong> 관리자를 삭제하시겠습니까?
              </Text>
              <Text mt={2} color="red.500">
                이 작업은 되돌릴 수 없습니다.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteConfirmRef} onClick={() => setIsDeleteModalOpen(false)}>
                취소
              </Button>
              <Button colorScheme="red" onClick={() => handleDeleteUser(userToDelete)} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
} 