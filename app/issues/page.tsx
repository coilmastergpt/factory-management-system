'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
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
  Textarea,
  Select,
  useDisclosure,
  useToast,
  HStack,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Divider,
  ButtonGroup
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import IssueFilterComponent from '../components/IssueFilter';
import FilterPresetManager from '../components/FilterPresetManager';
import { useFileUpload, UploadedFile } from '../components/FileUploadHelper';

// 이슈 타입 정의
interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department: string;
  issueType: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    companyId: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
}

// 필터 타입 정의
interface IssueFilter {
  status?: string;
  priority?: string;
  department?: string;
  assignedToId?: string;
  createdById?: string;
  issueType?: string;
  search?: string;
}

// 정렬 타입 정의
interface IssueSort {
  field: string;
  order: 'asc' | 'desc';
}

// 작업자 인터페이스 정의
interface Worker {
  id: string;
  name: string;
  companyId: string;
  role?: string;
}

// 사용자 인터페이스 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

// 상태 및 우선순위 색상 매핑
const statusColors = {
  OPEN: 'red',
  IN_PROGRESS: 'yellow',
  RESOLVED: 'green',
  CLOSED: 'gray'
};

const priorityColors = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  CRITICAL: 'red'
};

export default function IssuesPage() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 상태 관리
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<IssueFilter>({});
  const [sort, setSort] = useState<IssueSort>({ field: 'createdAt', order: 'desc' });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    month: ''
  });
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    department: '생산',
    issueType: '',
    createdById: '',
    createdByName: '',
    assignedToId: '',
    attachments: [] as Array<{
      url: string;
      name: string;
      size: number;
      type: string;
    }>
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [managers, setManagers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [issueTypes, setIssueTypes] = useState<{id: string, name: string, value: string}[]>([]);
  const [priorities, setPriorities] = useState<{id: string, name: string, value: string, color: string}[]>([]);
  
  // 파일 업로드 훅 사용
  const { uploading, uploadFiles } = useFileUpload();
  
  // 설정 데이터 가져오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('설정 정보를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setWorkers(data.workers || []);
        
        // 매니저 역할을 가진 작업자만 필터링
        const managerWorkers = (data.workers || []).filter((worker: Worker) => 
          worker.role === 'MANAGER' || worker.role === 'ADMIN'
        );
        setManagers(managerWorkers);
        
        // 사용자 관리의 사용자 목록 불러오기
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('사용자 목록을 불러오는데 실패했습니다.');
        }
        
        const usersData = await usersResponse.json();
        setUsers(usersData || []);
        
        setIssueTypes(data.issueTypes || []);
        setPriorities(data.priorities || []);
      } catch (error) {
        console.error('설정 정보 불러오기 오류:', error);
        toast({
          title: '설정 정보 불러오기 실패',
          description: '설정 정보를 불러오는데 실패했습니다.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    fetchSettings();
  }, []);
  
  // 이슈 목록 불러오기
  const fetchIssues = async () => {
    setLoading(true);
    try {
      // 필터와 정렬 정보를 쿼리 파라미터로 변환
      const queryParams = new URLSearchParams();
      
      // 페이지네이션 정보 추가
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      // 정렬 정보 추가
      queryParams.append('sortField', sort.field);
      queryParams.append('sortOrder', sort.order);
      
      // 필터 정보 추가
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // 날짜 필터 추가
      if (dateFilter.startDate) {
        queryParams.append('startDate', dateFilter.startDate);
      }
      if (dateFilter.endDate) {
        queryParams.append('endDate', dateFilter.endDate);
      }
      if (dateFilter.month) {
        queryParams.append('month', dateFilter.month);
      }
      
      const response = await fetch(`/api/issues?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('이슈 목록을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setIssues(data.issues);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: Math.ceil(data.total / prev.limit)
      }));
    } catch (error) {
      console.error('이슈 목록 불러오기 오류:', error);
      toast({
        title: '이슈 목록 불러오기 실패',
        description: '이슈 목록을 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 파일 업로드 처리
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      const files = await uploadFiles(e.target.files);
      
      if (files.length > 0) {
        setNewIssue(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...files]
        }));
        
        toast({
          title: '파일 업로드 성공',
          description: `${files.length}개의 파일이 업로드되었습니다.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      toast({
        title: '파일 업로드 실패',
        description: '파일 업로드 중 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // 파일 삭제 처리
  const handleRemoveFile = (index: number) => {
    setNewIssue(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };
  
  // 이슈 생성
  const handleCreateIssue = async () => {
    try {
      if (!newIssue.title.trim()) {
        toast({
          title: '제목 필수',
          description: '이슈 제목을 입력해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      if (!newIssue.createdById) {
        toast({
          title: '발견자 필수',
          description: '문제를 발견한 작업자를 선택해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      if (!newIssue.issueType) {
        toast({
          title: '문제 유형 필수',
          description: '문제 유형을 선택해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newIssue,
          attachments: newIssue.attachments
        }),
      });
      
      if (!response.ok) throw new Error('이슈 생성에 실패했습니다.');
      
      // 성공 메시지 표시
      toast({
        title: '이슈 생성 성공',
        description: '새 이슈가 생성되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 모달 닫기 및 폼 초기화
      onClose();
      setNewIssue({
        title: '',
        description: '',
        priority: 'MEDIUM',
        department: '생산',
        issueType: '',
        createdById: '',
        createdByName: '',
        assignedToId: '',
        attachments: []
      });
      
      // 이슈 목록 새로고침
      fetchIssues();
    } catch (error) {
      console.error('이슈 생성 오류:', error);
      toast({
        title: '이슈 생성 실패',
        description: '이슈를 생성하는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // 정렬 변경 핸들러
  const handleSortChange = (field: string) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value === '전체' ? undefined : value
    }));
  };
  
  // 날짜 필터 변경 핸들러
  const handleDateFilterChange = (type: string, value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [type]: value
    }));
    
    // 월 선택 시 시작일과 종료일 초기화
    if (type === 'month' && value) {
      setDateFilter(prev => ({
        month: value,
        startDate: '',
        endDate: ''
      }));
    }
    
    // 날짜 범위 선택 시 월 선택 초기화
    if ((type === 'startDate' || type === 'endDate') && value) {
      setDateFilter(prev => ({
        ...prev,
        [type]: value,
        month: ''
      }));
    }
  };
  
  // 이슈 상세 페이지로 이동
  const navigateToIssueDetail = (issueId: string) => {
    router.push(`/issues/${issueId}`);
  };
  
  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // 컴포넌트 마운트 시 이슈 목록 불러오기
  useEffect(() => {
    fetchIssues();
  }, [filter, sort, pagination.page, pagination.limit, dateFilter]);
  
  return (
    <Container maxW="container.xl" py={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">이슈 관리</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          새 이슈
        </Button>
      </Flex>
      
      {/* 필터 영역 */}
      <Box mb={6}>
        <Flex justifyContent="space-between" mb={4}>
          <IssueFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            onSearch={fetchIssues}
          />
          <FilterPresetManager
            currentFilter={filter}
            onPresetSelect={setFilter}
          />
        </Flex>
        
        {/* 날짜 필터 추가 */}
        <Flex mt={4} gap={4} alignItems="center">
          <Box>
            <FormLabel fontSize="sm">날짜 범위</FormLabel>
            <Flex gap={2} alignItems="center">
              <Input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                size="sm"
                w="150px"
              />
              <Text>~</Text>
              <Input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                size="sm"
                w="150px"
              />
            </Flex>
          </Box>
          
          <Box>
            <FormLabel fontSize="sm">월별 필터</FormLabel>
            <Select
              value={dateFilter.month}
              onChange={(e) => handleDateFilterChange('month', e.target.value)}
              size="sm"
              w="150px"
            >
              <option value="">전체</option>
              <option value="1">1월</option>
              <option value="2">2월</option>
              <option value="3">3월</option>
              <option value="4">4월</option>
              <option value="5">5월</option>
              <option value="6">6월</option>
              <option value="7">7월</option>
              <option value="8">8월</option>
              <option value="9">9월</option>
              <option value="10">10월</option>
              <option value="11">11월</option>
              <option value="12">12월</option>
            </Select>
          </Box>
          
          <Button
            colorScheme="blue"
            size="sm"
            onClick={fetchIssues}
            ml={2}
          >
            필터 적용
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFilter({
                startDate: '',
                endDate: '',
                month: ''
              });
            }}
          >
            날짜 필터 초기화
          </Button>
        </Flex>
      </Box>
      
      {/* 이슈 목록 */}
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        {loading ? (
          <Center p={8}>
            <Spinner size="xl" />
          </Center>
        ) : issues.length === 0 ? (
          <Center p={8} flexDirection="column">
            <Text fontSize="lg" mb={4}>이슈가 없습니다.</Text>
            <Button colorScheme="blue" onClick={onOpen}>새 이슈 생성</Button>
          </Center>
        ) : (
          <>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="80px">번호</Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('title')}>
                    제목
                    {sort.field === 'title' && (
                      <ChevronDownIcon 
                        ml={1} 
                        transform={sort.order === 'asc' ? 'rotate(180deg)' : undefined}
                      />
                    )}
                  </Th>
                  <Th>상태</Th>
                  <Th>우선순위</Th>
                  <Th>부서</Th>
                  <Th>문제 유형</Th>
                  <Th>발견자</Th>
                  <Th>담당자</Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('createdAt')}>
                    생성일
                    {sort.field === 'createdAt' && (
                      <ChevronDownIcon 
                        ml={1} 
                        transform={sort.order === 'asc' ? 'rotate(180deg)' : undefined}
                      />
                    )}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('resolvedAt')}>
                    완료일
                    {sort.field === 'resolvedAt' && (
                      <ChevronDownIcon 
                        ml={1} 
                        transform={sort.order === 'asc' ? 'rotate(180deg)' : undefined}
                      />
                    )}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {issues.map((issue, index) => (
                  <Tr 
                    key={issue.id} 
                    _hover={{ bg: 'gray.50' }}
                    cursor="pointer"
                    onClick={() => navigateToIssueDetail(issue.id)}
                  >
                    <Td>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {isNaN(parseInt(issue.id)) ? issue.id.split('-')[1] : issue.id}
                      </Badge>
                    </Td>
                    <Td fontWeight="medium">
                      {issue.title}
                    </Td>
                    <Td>
                      <Badge colorScheme={statusColors[issue.status]}>
                        {issue.status === 'OPEN' && '대기중'}
                        {issue.status === 'IN_PROGRESS' && '진행중'}
                        {issue.status === 'RESOLVED' && '해결됨'}
                        {issue.status === 'CLOSED' && '종료'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={priorityColors[issue.priority]}>
                        {issue.priority === 'LOW' && '낮음'}
                        {issue.priority === 'MEDIUM' && '중간'}
                        {issue.priority === 'HIGH' && '높음'}
                        {issue.priority === 'CRITICAL' && '긴급'}
                      </Badge>
                    </Td>
                    <Td>{issue.department}</Td>
                    <Td>{issue.issueType}</Td>
                    <Td>{issue.createdBy.name} ({issue.createdBy.companyId})</Td>
                    <Td>{issue.assignedTo ? `${issue.assignedTo.name}` : '-'}</Td>
                    <Td>{new Date(issue.createdAt).toLocaleDateString()}</Td>
                    <Td>{issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : '-'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <Flex justifyContent="center" p={4}>
                <ButtonGroup variant="outline" spacing={2}>
                  <IconButton
                    aria-label="이전 페이지"
                    icon={<ChevronLeftIcon />}
                    isDisabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.totalPages || 
                      Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => {
                      // 페이지 번호 사이에 ... 표시
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <Button variant="ghost" isDisabled>...</Button>
                            <Button
                              variant={pagination.page === page ? 'solid' : 'outline'}
                              colorScheme={pagination.page === page ? 'blue' : 'gray'}
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
                          variant={pagination.page === page ? 'solid' : 'outline'}
                          colorScheme={pagination.page === page ? 'blue' : 'gray'}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })
                  }
                  
                  <IconButton
                    aria-label="다음 페이지"
                    icon={<ChevronRightIcon />}
                    isDisabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </ButtonGroup>
              </Flex>
            )}
          </>
        )}
      </Box>
      
      {/* 새 이슈 생성 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 이슈 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>제목</FormLabel>
                <Input 
                  placeholder="이슈 제목" 
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea 
                  placeholder="이슈에 대한 상세 설명" 
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  rows={5}
                />
              </FormControl>
              
              {/* 파일 첨부 영역 */}
              <FormControl>
                <FormLabel>파일 첨부</FormLabel>
                <Box border="1px dashed" borderColor="gray.300" p={4} borderRadius="md">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                  <Flex direction="column" align="center">
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      colorScheme="blue"
                      variant="outline"
                      isLoading={uploading}
                      loadingText="업로드 중..."
                      mb={3}
                    >
                      이미지/동영상 선택
                    </Button>
                    <Text fontSize="sm" color="gray.500">
                      이미지(10MB 이하) 또는 동영상(100MB 이하) 파일을 선택하세요.
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      파일은 자동으로 최적화되어 저장됩니다.
                    </Text>
                  </Flex>
                </Box>
                
                {/* 첨부 파일 미리보기 */}
                {newIssue.attachments.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="medium" mb={2}>첨부된 파일 ({newIssue.attachments.length}개)</Text>
                    <VStack spacing={2} align="stretch">
                      {newIssue.attachments.map((file, index) => (
                        <Flex 
                          key={index} 
                          p={2} 
                          border="1px solid" 
                          borderColor="gray.200" 
                          borderRadius="md"
                          justify="space-between"
                          align="center"
                        >
                          <Flex align="center">
                            {file.type.startsWith('image/') ? (
                              <Box mr={3} width="50px" height="50px">
                                <img 
                                  src={file.url} 
                                  alt={file.name} 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }} 
                                />
                              </Box>
                            ) : (
                              <Box 
                                mr={3} 
                                width="50px" 
                                height="50px" 
                                bg="gray.100" 
                                borderRadius="4px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text fontSize="xs">비디오</Text>
                              </Box>
                            )}
                            <VStack spacing={0} align="start">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {file.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </Text>
                            </VStack>
                          </Flex>
                          <Button 
                            size="sm" 
                            colorScheme="red" 
                            variant="ghost"
                            onClick={() => handleRemoveFile(index)}
                          >
                            삭제
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>우선순위</FormLabel>
                <Select 
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.value}>{priority.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>부서</FormLabel>
                <Select 
                  value={newIssue.department}
                  onChange={(e) => setNewIssue({...newIssue, department: e.target.value})}
                >
                  <option value="생산">생산</option>
                  <option value="품질">품질</option>
                  <option value="유지보수">유지보수</option>
                  <option value="안전">안전</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>문제 유형</FormLabel>
                <Select 
                  placeholder="문제 유형 선택"
                  value={newIssue.issueType}
                  onChange={(e) => setNewIssue({...newIssue, issueType: e.target.value})}
                >
                  {issueTypes.map((type) => (
                    <option key={type.id} value={type.value}>{type.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>발견자</FormLabel>
                <Select 
                  placeholder="문제를 발견한 작업자 선택"
                  value={newIssue.createdById}
                  onChange={(e) => {
                    const selectedWorker = workers.find(w => w.id === e.target.value);
                    setNewIssue({
                      ...newIssue, 
                      createdById: e.target.value,
                      createdByName: selectedWorker ? selectedWorker.name : ''
                    });
                  }}
                >
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.name} ({worker.companyId})</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>담당자</FormLabel>
                <Select 
                  placeholder="담당자 선택 (선택사항)"
                  value={newIssue.assignedToId}
                  onChange={(e) => setNewIssue({...newIssue, assignedToId: e.target.value})}
                >
                  <option value="">담당자 없음</option>
                  {users.filter(user => user.role === 'MANAGER' || user.role === 'ADMIN').map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.department})</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateIssue}
              isDisabled={!newIssue.title || !newIssue.priority || !newIssue.department || !newIssue.issueType || !newIssue.createdById}
            >
              생성
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
} 