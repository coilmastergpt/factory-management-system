'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Grid,
  GridItem,
  VStack,
  HStack,
  Button,
  useToast,
  Divider,
  Textarea,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Flex,
  Avatar,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CommentSection from '../../components/CommentSection';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department: string;
  issueType: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    companyId: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  solution?: string;
}

interface Comment {
  id: string;
  content: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Worker {
  id: string;
  name: string;
  companyId: string;
  email: string;
  department: string;
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

interface CommentSectionProps {
  issueId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const statusColors = {
  OPEN: 'red',
  IN_PROGRESS: 'yellow',
  RESOLVED: 'green',
  CLOSED: 'gray',
};

const priorityColors = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  CRITICAL: 'red',
};

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  onUpdate: (status: Issue['status'], solution?: string) => void;
}

function UpdateModal({ isOpen, onClose, issue, onUpdate }: UpdateModalProps) {
  const [status, setStatus] = useState<Issue['status']>(issue.status);
  const [solution, setSolution] = useState(issue.solution || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(issue.status);
    setSolution(issue.solution || '');
  }, [issue]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onUpdate(status, solution);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>이슈 상태 업데이트</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>상태</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value as Issue['status'])}>
                <option value="OPEN">대기중</option>
                <option value="IN_PROGRESS">진행중</option>
                <option value="RESOLVED">해결됨</option>
                <option value="CLOSED">종료</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>해결 방안</FormLabel>
              <Textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="해결 방안을 입력하세요"
                rows={5}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [managers, setManagers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<User[]>([]); // 사용자 관리의 사용자 목록
  
  // 삭제 확인 다이얼로그
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onDeleteAlertClose = () => setIsDeleteAlertOpen(false);
  const onDeleteAlertOpen = () => setIsDeleteAlertOpen(true);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/issues/${params.id}`);
      
      if (!response.ok) {
        throw new Error('이슈 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setIssue(data);
      
      // 댓글 불러오기
      const commentsResponse = await fetch(`/api/issues/${params.id}/comments`);
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error('이슈 상세 정보 불러오기 오류:', error);
      toast({
        title: '이슈 정보 불러오기 실패',
        description: '이슈 정보를 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 작업자 및 사용자 목록 불러오기
  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('작업자 목록을 불러오는데 실패했습니다.');
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
    } catch (error) {
      console.error('작업자 목록 불러오기 오류:', error);
    }
  };
  
  // 담당자 변경 함수
  const handleAssigneeChange = async (workerId: string) => {
    try {
      const response = await fetch(`/api/issues/${params.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedToId: workerId }),
      });
      
      if (!response.ok) {
        throw new Error('담당자 변경에 실패했습니다.');
      }
      
      const updatedIssue = await response.json();
      setIssue(updatedIssue);
      
      toast({
        title: '담당자 변경 완료',
        description: '이슈 담당자가 변경되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('담당자 변경 오류:', error);
      toast({
        title: '담당자 변경 실패',
        description: '담당자 변경 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchIssueDetail();
    fetchWorkers();
  }, [params.id]);

  const handleUpdate = async (newStatus: Issue['status'], newSolution?: string) => {
    if (!issue) return;

    try {
      const response = await fetch(`/api/issues/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...issue,
          status: newStatus,
          solution: newSolution,
        }),
      });

      if (!response.ok) {
        throw new Error('이슈 수정에 실패했습니다.');
      }

      toast({
        title: '이슈가 수정되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchIssueDetail();
    } catch (error) {
      console.error('이슈 수정 오류:', error);
      toast({
        title: '이슈 수정에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!issue) return;

    try {
      const response = await fetch(`/api/issues/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('이슈 삭제에 실패했습니다.');
      }

      toast({
        title: '이슈가 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/issues');
    } catch (error) {
      console.error('이슈 삭제 오류:', error);
      toast({
        title: '이슈 삭제에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (!issue) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{issue.title}</Heading>
          <HStack>
            <Button colorScheme="blue" onClick={onOpen}>
              상태 변경
            </Button>
            <Button colorScheme="red" onClick={onDeleteAlertOpen}>
              삭제
            </Button>
          </HStack>
        </HStack>

        <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={6}>
          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">설명</Text>
                  <Text whiteSpace="pre-wrap" mt={2}>{issue.description}</Text>
                </Box>

                {issue.solution && (
                  <Box mt={4}>
                    <Text fontSize="sm" color="gray.500">해결 방안</Text>
                    <Text whiteSpace="pre-wrap" mt={2}>{issue.solution}</Text>
                  </Box>
                )}
              </VStack>
            </Box>

            <Box mt={6}>
              <CommentSection issueId={issue.id} comments={comments} setComments={setComments} />
            </Box>
          </GridItem>

          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">상태</Text>
                  <Badge colorScheme={statusColors[issue.status]} mt={1} px={2} py={1} borderRadius="md">
                    {issue.status === 'OPEN' && '대기중'}
                    {issue.status === 'IN_PROGRESS' && '진행중'}
                    {issue.status === 'RESOLVED' && '해결됨'}
                    {issue.status === 'CLOSED' && '종료'}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">우선순위</Text>
                  <Badge colorScheme={priorityColors[issue.priority]} mt={1} px={2} py={1} borderRadius="md">
                    {issue.priority === 'LOW' && '낮음'}
                    {issue.priority === 'MEDIUM' && '중간'}
                    {issue.priority === 'HIGH' && '높음'}
                    {issue.priority === 'CRITICAL' && '긴급'}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">부서</Text>
                  <Text fontWeight="medium" mt={1}>{issue.department}</Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">문제 유형</Text>
                  <Text fontWeight="medium" mt={1}>{issue.issueType}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.500">생성자</Text>
                  <Flex align="center" mt={1}>
                    <Avatar size="sm" name={issue.createdBy.name} mr={2} />
                    <Box>
                      <Text fontWeight="medium">{issue.createdBy.name} ({issue.createdBy.companyId})</Text>
                      <Text fontSize="xs">{issue.createdBy.email}</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm" color="gray.500">담당자</Text>
                    <Menu>
                      <MenuButton as={Button} size="xs" rightIcon={<ChevronDownIcon />}>
                        변경
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleAssigneeChange('')}>담당자 없음</MenuItem>
                        <MenuDivider />
                        {users.filter(user => user.role === 'MANAGER' || user.role === 'ADMIN').map(user => (
                          <MenuItem 
                            key={user.id} 
                            onClick={() => handleAssigneeChange(user.id)}
                          >
                            {user.name} ({user.department})
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                  {issue.assignedTo ? (
                    <Text fontSize="sm" color="gray.500">{issue.assignedTo.name}</Text>
                  ) : (
                    <Text fontSize="sm" color="gray.500">담당자가 지정되지 않았습니다.</Text>
                  )}
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.500">생성일</Text>
                  <Text mt={1}>{formatDate(issue.createdAt)}</Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">최종 수정일</Text>
                  <Text mt={1}>{formatDate(issue.updatedAt)}</Text>
                </Box>

                {issue.resolvedAt && (
                  <Box>
                    <Text fontSize="sm" color="gray.500">해결일</Text>
                    <Text mt={1}>{formatDate(issue.resolvedAt)}</Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>

      <UpdateModal
        isOpen={isOpen}
        onClose={onClose}
        issue={issue}
        onUpdate={handleUpdate}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              이슈 삭제
            </AlertDialogHeader>

            <AlertDialogBody>
              이 이슈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                취소
              </Button>
              <Button colorScheme="red" onClick={() => {
                handleDelete();
                onDeleteAlertClose();
              }} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
} 