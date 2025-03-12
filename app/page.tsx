'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Center,
  List,
  ListItem,
  Badge,
  Divider,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HomeStats {
  totalIssues: number;
  openIssues: number;
  totalUsers: number;
  assignedIssues: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    department: string;
  }>;
}

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHomeStats = async () => {
      try {
        setLoading(true);
        
        // 이슈 데이터 가져오기
        const issuesResponse = await fetch('/api/issues');
        const usersResponse = await fetch('/api/users');
        
        if (!issuesResponse.ok || !usersResponse.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        
        const issuesData = await issuesResponse.json();
        const usersData = await usersResponse.json();
        
        // 이슈 통계 계산
        const issues = issuesData.issues || [];
        const openIssues = issues.filter((issue: any) => issue.status === 'OPEN').length;
        
        // 현재 로그인한 사용자에게 할당된 이슈 필터링
        const assignedIssues = issues.filter((issue: any) => 
          issue.assignedTo && user && issue.assignedTo.id === user.id
        ).map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          status: issue.status,
          priority: issue.priority,
          department: issue.department
        }));
        
        setStats({
          totalIssues: issues.length,
          openIssues: openIssues,
          totalUsers: usersData.users?.length || 0,
          assignedIssues: assignedIssues
        });
      } catch (error) {
        console.error('홈 통계 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHomeStats();
    }
  }, [user]);

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'red';
      case 'IN_PROGRESS': return 'yellow';
      case 'RESOLVED': return 'green';
      default: return 'gray';
    }
  };

  // 우선순위에 따른 배지 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'gray';
      case 'MEDIUM': return 'blue';
      case 'HIGH': return 'orange';
      case 'CRITICAL': return 'red';
      default: return 'gray';
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return '대기중';
      case 'IN_PROGRESS': return '진행중';
      case 'RESOLVED': return '해결됨';
      default: return status;
    }
  };

  // 우선순위 텍스트 변환
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW': return '낮음';
      case 'MEDIUM': return '중간';
      case 'HIGH': return '높음';
      case 'CRITICAL': return '긴급';
      default: return priority;
    }
  };

  const handleIssueClick = (issueId: string) => {
    router.push(`/issues/${issueId}`);
  };

  if (!user) return null;

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
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          안녕하세요, {user?.name || '사용자'}님!
        </Heading>
        <Text color="gray.600">
          오늘도 좋은 하루 되세요.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">이슈 현황</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>처리 대기</StatLabel>
              <StatNumber>{stats?.openIssues || 0}건</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">사용자</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>전체 사용자</StatLabel>
              <StatNumber>{stats?.totalUsers || 0}명</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">부서</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>소속 부서</StatLabel>
              <StatNumber>{user?.department || '-'}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* 담당 이슈 목록 (할 일) */}
      <Card>
        <CardHeader>
          <Heading size="md">내 담당 이슈 (할 일)</Heading>
        </CardHeader>
        <CardBody>
          {stats?.assignedIssues && stats.assignedIssues.length > 0 ? (
            <List spacing={3}>
              {stats.assignedIssues.map((issue) => (
                <ListItem key={issue.id} p={3} borderWidth="1px" borderRadius="md" _hover={{ bg: 'gray.50' }}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold" mb={1}>{issue.title}</Text>
                      <Flex gap={2}>
                        <Badge colorScheme={getStatusColor(issue.status)}>
                          {getStatusText(issue.status)}
                        </Badge>
                        <Badge colorScheme={getPriorityColor(issue.priority)}>
                          {getPriorityText(issue.priority)}
                        </Badge>
                        <Badge colorScheme="purple">{issue.department}</Badge>
                      </Flex>
                    </Box>
                    <Button size="sm" colorScheme="blue" onClick={() => handleIssueClick(issue.id)}>
                      상세보기
                    </Button>
                  </Flex>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text>담당 중인 이슈가 없습니다.</Text>
          )}
        </CardBody>
      </Card>
    </Container>
  );
} 