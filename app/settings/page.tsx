'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Badge,
  HStack,
  VStack,
  Divider,
  Text,
  Flex,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

// 타입 정의
interface Priority {
  id: string;
  name: string;
  value: string;
  color: string;
}

interface Department {
  id: string;
  name: string;
  value: string;
}

interface Worker {
  id: string;
  name: string;
  companyId: string;
  email: string;
  department: string;
}

interface IssueType {
  id: string;
  name: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 우선순위 상태
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [newPriority, setNewPriority] = useState<Omit<Priority, 'id'>>({
    name: '',
    value: '',
    color: 'blue',
  });
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  
  // 부서 상태
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
    name: '',
    value: '',
  });
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  // 작업자 상태
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [newWorker, setNewWorker] = useState<Omit<Worker, 'id'>>({
    name: '',
    companyId: '',
    email: '',
    department: '',
  });
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  
  // 문제 유형 상태
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [newIssueType, setNewIssueType] = useState<Omit<IssueType, 'id'>>({
    name: '',
    value: '',
    description: '',
  });
  const [editingIssueType, setEditingIssueType] = useState<IssueType | null>(null);
  
  // 모달 상태
  const { 
    isOpen: isPriorityModalOpen, 
    onOpen: onPriorityModalOpen, 
    onClose: onPriorityModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDepartmentModalOpen, 
    onOpen: onDepartmentModalOpen, 
    onClose: onDepartmentModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isWorkerModalOpen, 
    onOpen: onWorkerModalOpen, 
    onClose: onWorkerModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isIssueTypeModalOpen, 
    onOpen: onIssueTypeModalOpen, 
    onClose: onIssueTypeModalClose 
  } = useDisclosure();
  
  // 삭제 확인 다이얼로그 상태
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<'priorities' | 'departments' | 'workers' | 'issueTypes'>('priorities');
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // 데이터 로딩
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('설정을 불러오는데 실패했습니다');
      }
      const data = await response.json();
      setPriorities(data.priorities || []);
      setDepartments(data.departments || []);
      setIssueTypes(data.issueTypes || []);
      setWorkers(data.workers || []);
    } catch (error) {
      console.error('설정 로딩 오류:', error);
      toast({
        title: '설정 로딩 실패',
        description: '설정을 불러오는데 문제가 발생했습니다. 나중에 다시 시도해주세요.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 데이터 로딩
  useEffect(() => {
    fetchSettings();
  }, []);
  
  // 권한 체크 - 조건부 훅 사용 제거
  useEffect(() => {
    console.log('현재 사용자 정보:', user);
    console.log('사용자 역할:', user?.role);
    
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '설정 페이지에 접근하려면 로그인이 필요합니다.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      router.push('/');
      return;
    }
    
    // 대소문자 구분 없이 역할 비교
    const userRole = user.role?.toUpperCase();
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      toast({
        title: '접근 권한이 없습니다',
        description: `현재 역할(${user.role})로는 설정 페이지에 접근할 수 없습니다. 관리자 또는 매니저 권한이 필요합니다.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      router.push('/');
    }
  }, [user, router, toast]);

  // 로딩 중이거나 권한이 없는 경우 표시
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  
  // 삭제 확인 다이얼로그 열기
  const openDeleteAlert = (type: 'priorities' | 'departments' | 'workers' | 'issueTypes', id: string) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setIsDeleteAlertOpen(true);
  };
  
  // 삭제 확인 다이얼로그 닫기
  const closeDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
  };
  
  // 항목 삭제 처리
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/settings?type=${deleteItemType}&id=${deleteItemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('항목 삭제에 실패했습니다.');
      }
      
      const data = await response.json();
      
      if (deleteItemType === 'priorities') {
        setPriorities(data.priorities);
        toast({
          title: '우선순위 삭제됨',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (deleteItemType === 'departments') {
        setDepartments(data.departments);
        toast({
          title: '부서 삭제됨',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (deleteItemType === 'workers') {
        setWorkers(data.workers);
        toast({
          title: '작업자 삭제됨',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (deleteItemType === 'issueTypes') {
        setIssueTypes(data.issueTypes);
        toast({
          title: '문제 유형 삭제됨',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('항목 삭제 오류:', error);
      toast({
        title: '삭제 실패',
        description: '항목을 삭제하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      closeDeleteAlert();
    }
  };
  
  // 우선순위 추가/수정
  const handlePrioritySave = async () => {
    try {
      console.log('저장할 우선순위 데이터:', newPriority);
      
      const payload = {
        type: 'priorities',
        item: editingPriority 
          ? { ...editingPriority, name: newPriority.name, value: newPriority.value, color: newPriority.color }
          : newPriority
      };
      
      console.log('API 요청 페이로드:', payload);
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 오류 응답:', errorData);
        throw new Error(`우선순위 저장에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      
      setPriorities(data.priorities || []);
      
      toast({
        title: editingPriority ? '우선순위 수정됨' : '우선순위 추가됨',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 상태 초기화
      setNewPriority({ name: '', value: '', color: 'blue' });
      setEditingPriority(null);
      onPriorityModalClose();
    } catch (error: any) {
      console.error('우선순위 저장 오류:', error);
      toast({
        title: '저장 실패',
        description: `우선순위를 저장하는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 부서 추가/수정
  const handleDepartmentSave = async () => {
    try {
      const payload = {
        type: 'departments',
        item: editingDepartment 
          ? { ...editingDepartment, name: newDepartment.name, value: newDepartment.value }
          : newDepartment
      };
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('부서 저장에 실패했습니다.');
      }
      
      const data = await response.json();
      setDepartments(data.departments);
      
      toast({
        title: editingDepartment ? '부서 수정됨' : '부서 추가됨',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 상태 초기화
      setNewDepartment({ name: '', value: '' });
      setEditingDepartment(null);
      onDepartmentModalClose();
    } catch (error) {
      console.error('부서 저장 오류:', error);
      toast({
        title: '저장 실패',
        description: '부서를 저장하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 작업자 추가/수정
  const handleWorkerSave = async () => {
    try {
      const payload = {
        type: 'workers',
        item: editingWorker 
          ? { ...editingWorker, name: newWorker.name, companyId: newWorker.companyId, email: newWorker.email, department: newWorker.department }
          : newWorker
      };
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('작업자 저장에 실패했습니다.');
      }
      
      const data = await response.json();
      setWorkers(data.workers);
      
      toast({
        title: editingWorker ? '작업자 수정됨' : '작업자 추가됨',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 상태 초기화
      setNewWorker({ name: '', companyId: '', email: '', department: '' });
      setEditingWorker(null);
      onWorkerModalClose();
    } catch (error) {
      console.error('작업자 저장 오류:', error);
      toast({
        title: '저장 실패',
        description: '작업자를 저장하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 문제 유형 추가/수정
  const handleIssueTypeSave = async () => {
    try {
      const payload = {
        type: 'issueTypes',
        item: editingIssueType 
          ? { ...editingIssueType, name: newIssueType.name, value: newIssueType.value, description: newIssueType.description }
          : newIssueType
      };
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('문제 유형 저장에 실패했습니다.');
      }
      
      const data = await response.json();
      setIssueTypes(data.issueTypes);
      
      toast({
        title: editingIssueType ? '문제 유형 수정됨' : '문제 유형 추가됨',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 상태 초기화
      setNewIssueType({ name: '', value: '', description: '' });
      setEditingIssueType(null);
      onIssueTypeModalClose();
    } catch (error) {
      console.error('문제 유형 저장 오류:', error);
      toast({
        title: '저장 실패',
        description: '문제 유형을 저장하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 우선순위 수정 모달 열기
  const openEditPriorityModal = (priority: Priority) => {
    setEditingPriority(priority);
    setNewPriority({
      name: priority.name,
      value: priority.value,
      color: priority.color,
    });
    onPriorityModalOpen();
  };
  
  // 부서 수정 모달 열기
  const openEditDepartmentModal = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      value: department.value,
    });
    onDepartmentModalOpen();
  };
  
  // 작업자 수정 모달 열기
  const openEditWorkerModal = (worker: Worker) => {
    setEditingWorker(worker);
    setNewWorker({
      name: worker.name,
      companyId: worker.companyId,
      email: worker.email,
      department: worker.department,
    });
    onWorkerModalOpen();
  };
  
  // 문제 유형 수정 모달 열기
  const openEditIssueTypeModal = (issueType: IssueType) => {
    setEditingIssueType(issueType);
    setNewIssueType({
      name: issueType.name,
      value: issueType.value,
      description: issueType.description,
    });
    onIssueTypeModalOpen();
  };
  
  // 새 우선순위 모달 열기
  const openNewPriorityModal = () => {
    setEditingPriority(null);
    setNewPriority({ name: '', value: '', color: 'blue' });
    onPriorityModalOpen();
  };
  
  // 새 부서 모달 열기
  const openNewDepartmentModal = () => {
    setEditingDepartment(null);
    setNewDepartment({ name: '', value: '' });
    onDepartmentModalOpen();
  };
  
  // 새 작업자 모달 열기
  const openNewWorkerModal = () => {
    setEditingWorker(null);
    setNewWorker({ name: '', companyId: '', email: '', department: '' });
    onWorkerModalOpen();
  };
  
  // 새 문제 유형 모달 열기
  const openNewIssueTypeModal = () => {
    setEditingIssueType(null);
    setNewIssueType({ name: '', value: '', description: '' });
    onIssueTypeModalOpen();
  };
  
  // 설정 페이지 내부에서 관리자와 매니저의 권한 구분
  const isAdmin = user?.role === 'ADMIN';

  // 탭 변경 핸들러에 권한 체크 추가
  const handleTabChange = (index: number) => {
    // 매니저는 사용자 관리 탭(인덱스 3)에 접근할 수 없음
    if (!isAdmin && index === 3) {
      toast({
        title: '접근 권한 없음',
        description: '사용자 관리 탭은 관리자만 접근할 수 있습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setActiveTab(index);
  };
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>시스템 설정</Heading>
      
      {/* 관리자/매니저 권한 표시 */}
      <Box mb={4}>
        <Badge colorScheme={isAdmin ? 'red' : 'green'} fontSize="sm" p={1}>
          {isAdmin ? '관리자 권한' : '매니저 권한'}
        </Badge>
        {!isAdmin && (
          <Text fontSize="sm" color="gray.500" mt={1}>
            일부 설정은 관리자만 변경할 수 있습니다.
          </Text>
        )}
      </Box>

      <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed">
        <TabList>
          <Tab>우선순위 관리</Tab>
          <Tab>부서 관리</Tab>
          <Tab>문제 유형 관리</Tab>
          <Tab isDisabled={!isAdmin}>작업자 관리</Tab>
        </TabList>
        
        <TabPanels>
          {/* 우선순위 관리 */}
          <TabPanel>
            <Flex justifyContent="space-between" mb={4}>
              <Heading size="md">우선순위 목록</Heading>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openNewPriorityModal}>
                새 우선순위
              </Button>
            </Flex>
            
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>이름</Th>
                    <Th>값</Th>
                    <Th>색상</Th>
                    <Th width="100px">작업</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {priorities.map((priority) => (
                    <Tr key={priority.id}>
                      <Td>{priority.name}</Td>
                      <Td>{priority.value}</Td>
                      <Td>
                        <Badge colorScheme={priority.color}>{priority.color}</Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="수정"
                            icon={<EditIcon />}
                            size="sm"
                            onClick={() => openEditPriorityModal(priority)}
                          />
                          <IconButton
                            aria-label="삭제"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => openDeleteAlert('priorities', priority.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
          
          {/* 부서 관리 */}
          <TabPanel>
            <Flex justifyContent="space-between" mb={4}>
              <Heading size="md">부서 목록</Heading>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openNewDepartmentModal}>
                새 부서
              </Button>
            </Flex>
            
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>이름</Th>
                    <Th>값</Th>
                    <Th width="100px">작업</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {departments.map((department) => (
                    <Tr key={department.id}>
                      <Td>{department.name}</Td>
                      <Td>{department.value}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="수정"
                            icon={<EditIcon />}
                            size="sm"
                            onClick={() => openEditDepartmentModal(department)}
                          />
                          <IconButton
                            aria-label="삭제"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => openDeleteAlert('departments', department.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
          
          {/* 문제 유형 관리 */}
          <TabPanel>
            <Flex justifyContent="space-between" mb={4}>
              <Heading size="md">문제 유형 목록</Heading>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openNewIssueTypeModal}>
                새 문제 유형
              </Button>
            </Flex>
            
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>이름</Th>
                    <Th>값</Th>
                    <Th>설명</Th>
                    <Th width="100px">작업</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {issueTypes.map((issueType) => (
                    <Tr key={issueType.id}>
                      <Td>{issueType.name}</Td>
                      <Td>{issueType.value}</Td>
                      <Td>{issueType.description}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="수정"
                            icon={<EditIcon />}
                            size="sm"
                            onClick={() => openEditIssueTypeModal(issueType)}
                          />
                          <IconButton
                            aria-label="삭제"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => openDeleteAlert('issueTypes', issueType.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
          
          {/* 작업자 관리 - 관리자만 접근 가능 */}
          <TabPanel>
            {isAdmin ? (
              <Flex justifyContent="space-between" mb={4}>
                <Heading size="md">작업자 목록</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={openNewWorkerModal}>
                  새 작업자
                </Button>
              </Flex>
            ) : (
              <Alert status="warning">
                <AlertIcon />
                <AlertTitle>접근 권한 없음</AlertTitle>
                <AlertDescription>작업자 관리는 관리자만 접근할 수 있습니다.</AlertDescription>
              </Alert>
            )}
            
            {isAdmin && (
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>이름</Th>
                      <Th>회사 ID</Th>
                      <Th>이메일</Th>
                      <Th>부서</Th>
                      <Th width="100px">작업</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {workers.map((worker) => (
                      <Tr key={worker.id}>
                        <Td>{worker.name}</Td>
                        <Td>{worker.companyId}</Td>
                        <Td>{worker.email}</Td>
                        <Td>{worker.department}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="수정"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => openEditWorkerModal(worker)}
                            />
                            <IconButton
                              aria-label="삭제"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => openDeleteAlert('workers', worker.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* 우선순위 추가/수정 모달 */}
      <Modal isOpen={isPriorityModalOpen} onClose={onPriorityModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingPriority ? '우선순위 수정' : '새 우선순위 추가'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input 
                  placeholder="우선순위 이름" 
                  value={newPriority.name}
                  onChange={(e) => setNewPriority({...newPriority, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>값</FormLabel>
                <Input 
                  placeholder="시스템 값 (예: LOW, MEDIUM)" 
                  value={newPriority.value}
                  onChange={(e) => setNewPriority({...newPriority, value: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>색상</FormLabel>
                <Select 
                  value={newPriority.color}
                  onChange={(e) => setNewPriority({...newPriority, color: e.target.value})}
                >
                  <option value="gray">회색</option>
                  <option value="blue">파란색</option>
                  <option value="green">녹색</option>
                  <option value="red">빨간색</option>
                  <option value="orange">주황색</option>
                  <option value="purple">보라색</option>
                  <option value="teal">청록색</option>
                  <option value="yellow">노란색</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPriorityModalClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handlePrioritySave}
              isDisabled={!newPriority.name || !newPriority.value}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 부서 추가/수정 모달 */}
      <Modal isOpen={isDepartmentModalOpen} onClose={onDepartmentModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingDepartment ? '부서 수정' : '새 부서 추가'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input 
                  placeholder="부서 이름" 
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>값</FormLabel>
                <Input 
                  placeholder="시스템 값 (예: 생산, 품질)" 
                  value={newDepartment.value}
                  onChange={(e) => setNewDepartment({...newDepartment, value: e.target.value})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDepartmentModalClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleDepartmentSave}
              isDisabled={!newDepartment.name || !newDepartment.value}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 작업자 추가/수정 모달 */}
      <Modal isOpen={isWorkerModalOpen} onClose={onWorkerModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingWorker ? '작업자 수정' : '새 작업자 추가'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input 
                  placeholder="작업자 이름" 
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>회사 ID</FormLabel>
                <Input 
                  placeholder="회사 ID" 
                  value={newWorker.companyId}
                  onChange={(e) => setNewWorker({...newWorker, companyId: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>이메일</FormLabel>
                <Input 
                  placeholder="이메일 (선택사항)" 
                  type="email"
                  value={newWorker.email}
                  onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>부서</FormLabel>
                <Select 
                  placeholder="부서 선택"
                  value={newWorker.department}
                  onChange={(e) => setNewWorker({...newWorker, department: e.target.value})}
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.value}>{dept.name}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onWorkerModalClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleWorkerSave}
              isDisabled={!newWorker.name || !newWorker.companyId || !newWorker.department}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 문제 유형 추가/수정 모달 */}
      <Modal isOpen={isIssueTypeModalOpen} onClose={onIssueTypeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingIssueType ? '문제 유형 수정' : '새 문제 유형 추가'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input 
                  placeholder="문제 유형 이름" 
                  value={newIssueType.name}
                  onChange={(e) => setNewIssueType({...newIssueType, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>값</FormLabel>
                <Input 
                  placeholder="시스템 값 (예: EQUIPMENT, MATERIAL)" 
                  value={newIssueType.value}
                  onChange={(e) => setNewIssueType({...newIssueType, value: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea 
                  placeholder="문제 유형에 대한 설명" 
                  value={newIssueType.description}
                  onChange={(e) => setNewIssueType({...newIssueType, description: e.target.value})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onIssueTypeModalClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleIssueTypeSave}
              isDisabled={!newIssueType.name || !newIssueType.value}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {deleteItemType === 'priorities' && '우선순위 삭제'}
              {deleteItemType === 'departments' && '부서 삭제'}
              {deleteItemType === 'workers' && '작업자 삭제'}
              {deleteItemType === 'issueTypes' && '문제 유형 삭제'}
            </AlertDialogHeader>

            <AlertDialogBody>
              이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              {deleteItemType === 'departments' && (
                <Text color="red.500" mt={2}>
                  주의: 이 부서에 속한 작업자가 있을 경우 문제가 발생할 수 있습니다.
                </Text>
              )}
              {deleteItemType === 'issueTypes' && (
                <Text color="red.500" mt={2}>
                  주의: 이 문제 유형을 사용하는 이슈가 있을 경우 문제가 발생할 수 있습니다.
                </Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteAlert}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
} 