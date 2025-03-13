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
  ButtonGroup,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import IssueFilterComponent from '../components/IssueFilter';
import FilterPresetManager from '../components/FilterPresetManager';
import { useFileUpload, UploadedFile } from '../components/FileUploadHelper';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  
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
          title: t('toast.upload.success'),
          description: `${files.length}${t('table.attachments')}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      toast({
        title: t('toast.upload.fail'),
        description: t('toast.upload.failDesc'),
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
          title: t('toast.title.required'),
          description: t('toast.title.requiredDesc'),
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      if (!newIssue.createdById) {
        toast({
          title: t('toast.reporter.required'),
          description: t('toast.reporter.requiredDesc'),
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      if (!newIssue.issueType) {
        toast({
          title: t('toast.issueType.required'),
          description: t('toast.issueType.requiredDesc'),
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
        title: t('toast.issue.createSuccess'),
        description: t('toast.issue.createSuccessDesc'),
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
        title: t('toast.issue.createFail'),
        description: t('toast.issue.createFailDesc'),
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
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Flex 
          justifyContent="space-between" 
          alignItems={{ base: "stretch", md: "center" }} 
          mb={4}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading size="lg">{t('issues.title')}</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="yellow"
            onClick={onOpen}
            shadow="md"
            size="lg"
            fontWeight="bold"
            width={{ base: "100%", md: "auto" }}
            borderWidth="3px"
            borderColor="yellow.400"
            bg="black"
            color="white"
            fontSize="lg"
            _hover={{
              bg: "gray.800",
              borderColor: "yellow.300",
              transform: "translateY(-2px)",
              boxShadow: "lg"
            }}
            _active={{
              bg: "gray.900",
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
          >
            {t('issues.create')}
          </Button>
        </Flex>
        <Text color="gray.600" mb={4}>
          {t('issues.description')}
        </Text>
      </Box>

      {/* 필터 영역 */}
      <Box 
        mb={6} 
        p={4} 
        bg="white" 
        borderRadius="lg" 
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4}>
          <IssueFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            onSearch={fetchIssues}
          />
          <Box flex="1">
            <FormControl>
              <FormLabel fontSize="sm">{t('issues.search')}</FormLabel>
              <InputGroup>
                <Input
                  placeholder={t('issues.search')}
                  value={filter.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <InputRightElement>
                  <SearchIcon color="gray.400" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </Flex>

        <Flex direction={{ base: 'column', md: 'row' }} gap={4} alignItems="flex-end">
          <Box flex="1">
            <FormLabel fontSize="sm">{t('issues.date.range')}</FormLabel>
            <Flex gap={2} alignItems="center">
              <Input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                size="md"
              />
              <Text>~</Text>
              <Input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                size="md"
              />
            </Flex>
          </Box>
          <ButtonGroup size="md">
            <Button
              colorScheme="brand"
              onClick={fetchIssues}
              leftIcon={<SearchIcon />}
            >
              {t('issues.filter.apply')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDateFilter({
                  startDate: '',
                  endDate: '',
                  month: ''
                });
                setFilter({});
                fetchIssues();
              }}
            >
              {t('issues.filter.reset')}
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
      
      {/* 이슈 목록 */}
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        bg="white" 
        shadow="sm"
        borderColor="gray.200"
      >
        {loading ? (
          <Center p={8}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : issues.length === 0 ? (
          <Center p={8} flexDirection="column">
            <Text fontSize="lg" mb={4} color="gray.600">{t('issues.empty')}</Text>
            <Button colorScheme="brand" onClick={onOpen} leftIcon={<AddIcon />}>{t('issues.create')}</Button>
          </Center>
        ) : (
          <>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="80px">{t('table.number')}</Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('title')}>
                    {t('table.title')}
                    {sort.field === 'title' && (
                      <ChevronDownIcon 
                        ml={1} 
                        transform={sort.order === 'asc' ? 'rotate(180deg)' : undefined}
                      />
                    )}
                  </Th>
                  <Th>{t('table.status')}</Th>
                  <Th>{t('table.priority')}</Th>
                  <Th>{t('table.department')}</Th>
                  <Th>{t('table.issueType')}</Th>
                  <Th>{t('table.reporter')}</Th>
                  <Th>{t('table.assignee')}</Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('createdAt')}>
                    {t('table.createdAt')}
                    {sort.field === 'createdAt' && (
                      <ChevronDownIcon 
                        ml={1} 
                        transform={sort.order === 'asc' ? 'rotate(180deg)' : undefined}
                      />
                    )}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSortChange('resolvedAt')}>
                    {t('table.resolvedAt')}
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
                    transition="background-color 0.2s"
                  >
                    <Td>
                      <Badge colorScheme="brand" borderRadius="full" px={2}>
                        {isNaN(parseInt(issue.id)) ? issue.id.split('-')[1] : issue.id}
                      </Badge>
                    </Td>
                    <Td fontWeight="medium">
                      {issue.title}
                      {issue.attachments && issue.attachments.length > 0 && (
                        <Text as="span" ml={2} color="gray.500" fontSize="sm">
                          ({t('table.attachments')} {issue.attachments.length})
                        </Text>
                      )}
                    </Td>
                    <Td>
                      <Badge colorScheme={statusColors[issue.status]}>
                        {issue.status === 'OPEN' && t('status.open')}
                        {issue.status === 'IN_PROGRESS' && t('status.inProgress')}
                        {issue.status === 'RESOLVED' && t('status.resolved')}
                        {issue.status === 'CLOSED' && t('status.closed')}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={priorityColors[issue.priority]}>
                        {issue.priority === 'LOW' && t('priority.low')}
                        {issue.priority === 'MEDIUM' && t('priority.medium')}
                        {issue.priority === 'HIGH' && t('priority.high')}
                        {issue.priority === 'CRITICAL' && t('priority.critical')}
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
              <Flex justifyContent="center" p={4} borderTopWidth="1px" borderColor="gray.200">
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
                              colorScheme={pagination.page === page ? 'brand' : 'gray'}
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
                          colorScheme={pagination.page === page ? 'brand' : 'gray'}
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
          <ModalHeader>{t('modal.issue.create')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>{t('modal.issue.title')}</FormLabel>
                <Input 
                  placeholder={t('modal.issue.title')}
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('modal.issue.description')}</FormLabel>
                <Textarea 
                  placeholder={t('modal.issue.description')}
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  rows={5}
                />
              </FormControl>
              
              {/* 파일 첨부 영역 */}
              <FormControl>
                <FormLabel>{t('modal.issue.attachments')}</FormLabel>
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
                      colorScheme="brand"
                      variant="outline"
                      isLoading={uploading}
                      loadingText="업로드 중..."
                      mb={3}
                      leftIcon={<AddIcon />}
                    >
                      {t('modal.issue.selectImage')}
                    </Button>
                    <Text fontSize="sm" color="gray.500">
                      {t('modal.issue.fileInfo')}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {t('modal.issue.fileOptimize')}
                    </Text>
                  </Flex>
                </Box>
                
                {/* 첨부 파일 미리보기 */}
                {newIssue.attachments.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="medium" mb={2}>{t('modal.issue.attachedFiles')} ({newIssue.attachments.length})</Text>
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
                          bg="gray.50"
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
                                <Text fontSize="xs">{t('modal.issue.video')}</Text>
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
                            {t('modal.issue.delete')}
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>{t('modal.issue.priority')}</FormLabel>
                <Select 
                  placeholder={t('select.priority')}
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                >
                  <option value="LOW">{t('priority.low')}</option>
                  <option value="MEDIUM">{t('priority.medium')}</option>
                  <option value="HIGH">{t('priority.high')}</option>
                  <option value="CRITICAL">{t('priority.critical')}</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>{t('modal.issue.department')}</FormLabel>
                <Select 
                  placeholder={t('select.department')}
                  value={newIssue.department}
                  onChange={(e) => setNewIssue({...newIssue, department: e.target.value})}
                >
                  <option value="생산">{t('department.production')}</option>
                  <option value="품질">{t('department.quality')}</option>
                  <option value="유지보수">{t('department.maintenance')}</option>
                  <option value="안전">{t('department.safety')}</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>{t('modal.issue.reporter')}</FormLabel>
                <Select 
                  placeholder={t('select.reporter')}
                  value={newIssue.createdById}
                  onChange={(e) => setNewIssue({...newIssue, createdById: e.target.value})}
                >
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.name} ({worker.companyId})</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>{t('modal.issue.issueType')}</FormLabel>
                <Select 
                  placeholder={t('select.issueType')}
                  value={newIssue.issueType}
                  onChange={(e) => setNewIssue({...newIssue, issueType: e.target.value})}
                >
                  {issueTypes.map((type) => (
                    <option key={type.id} value={type.value}>{type.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('modal.issue.assignee')}</FormLabel>
                <Select 
                  placeholder={t('select.assignee')}
                  value={newIssue.assignedToId}
                  onChange={(e) => setNewIssue({...newIssue, assignedToId: e.target.value})}
                >
                  <option value="">{t('modal.issue.noAssignee')}</option>
                  {users.filter(user => user.role === 'MANAGER' || user.role === 'ADMIN').map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.department})</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter 
            bg="gray.50" 
            borderTopWidth="1px" 
            borderColor="gray.200"
            flexDirection={{ base: "column", md: "row" }}
            gap={3}
          >
            <Button 
              colorScheme="brand" 
              onClick={() => {
                console.log('현재 이슈 상태:', {
                  title: newIssue.title,
                  priority: newIssue.priority,
                  department: newIssue.department,
                  issueType: newIssue.issueType,
                  createdById: newIssue.createdById
                });
                handleCreateIssue();
              }}
              isDisabled={!newIssue.title}
              leftIcon={<AddIcon />}
              size="lg"
              fontWeight="bold"
              color="black"
              bg="brand.400"
              borderWidth="2px"
              borderColor="brand.300"
              width={{ base: "100%", md: "auto" }}
              mr={{ base: 0, md: 3 }}
              mb={{ base: 3, md: 0 }}
            >
              {t('modal.issue.create.button')}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
              color="black"
              fontWeight="bold"
              width={{ base: "100%", md: "auto" }}
            >
              {t('modal.issue.cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
} 