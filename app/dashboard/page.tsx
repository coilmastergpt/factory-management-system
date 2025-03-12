'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Flex,
  Badge,
  Button,
  useToast,
  Spinner,
  Center,
  Card,
  CardHeader,
  CardBody,
  Progress,
  HStack,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiActivity, FiUsers, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// 간소화된 인터페이스
interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
  byWorker: {
    id: string;
    name: string;
    department: string;
    count: number;
    percentage: number;
  }[];
  byDepartment?: {
    department: string;
    count: number;
  }[];
  byPriority?: {
    priority: string;
    label: string;
    count: number;
    color: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // 임시 데이터 사용
      const mockStats = {
        totalIssues: 125,
        openIssues: 42,
        resolvedIssues: 68,
        criticalIssues: 15,
        byWorker: [
          {
            id: 'worker-1',
            name: '김작업자',
            department: '생산',
            count: 32,
            percentage: 26
          },
          {
            id: 'worker-2',
            name: '이엔지니어',
            department: '품질',
            count: 28,
            percentage: 22
          },
          {
            id: 'worker-3',
            name: '박기술자',
            department: '유지보수',
            count: 25,
            percentage: 20
          },
          {
            id: 'worker-4',
            name: '최관리자',
            department: '안전',
            count: 22,
            percentage: 18
          },
          {
            id: 'worker-5',
            name: '정감독관',
            department: '생산',
            count: 18,
            percentage: 14
          }
        ],
        byDepartment: [
          { department: '생산', count: 45 },
          { department: '품질', count: 30 },
          { department: '유지보수', count: 25 },
          { department: '안전', count: 15 },
          { department: '관리', count: 10 }
        ],
        byPriority: [
          { priority: 'LOW', label: '낮음', count: 20, color: 'gray' },
          { priority: 'MEDIUM', label: '중간', count: 45, color: 'blue' },
          { priority: 'HIGH', label: '높음', count: 35, color: 'orange' },
          { priority: 'CRITICAL', label: '긴급', count: 25, color: 'red' }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('대시보드 통계 로딩 오류:', error);
      toast({
        title: '통계 불러오기 실패',
        description: '대시보드 통계를 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (!stats) return null;

  // 가장 많은 이슈를 보고한 직원 TOP 5
  const topWorkers = [...stats.byWorker].sort((a, b) => b.count - a.count).slice(0, 5);

  // 우선순위별 이슈 분포 차트 데이터
  const priorityChartData = {
    labels: stats.byPriority?.map(item => item.label) || [],
    datasets: [
      {
        data: stats.byPriority?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(160, 174, 192, 0.8)',
          'rgba(66, 153, 225, 0.8)',
          'rgba(237, 137, 54, 0.8)',
          'rgba(229, 62, 62, 0.8)',
        ],
        borderColor: [
          'rgb(160, 174, 192)',
          'rgb(66, 153, 225)',
          'rgb(237, 137, 54)',
          'rgb(229, 62, 62)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 부서별 이슈 분포 차트 데이터
  const departmentChartData = {
    labels: stats.byDepartment?.map(item => item.department) || [],
    datasets: [
      {
        label: '이슈 수',
        data: stats.byDepartment?.map(item => item.count) || [],
        backgroundColor: 'rgba(66, 153, 225, 0.8)',
        borderColor: 'rgb(66, 153, 225)',
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>대시보드</Heading>
      
      {/* 주요 통계 */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiAlertCircle} boxSize={8} mr={2} color="blue.500" />
                <Box>
                  <StatLabel>전체 이슈</StatLabel>
                  <StatNumber>{stats.totalIssues}</StatNumber>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiClock} boxSize={8} mr={2} color="red.500" />
                <Box>
                  <StatLabel>대기 중인 이슈</StatLabel>
                  <StatNumber>{stats.openIssues}</StatNumber>
                  <StatHelpText>
                    전체의 {Math.round((stats.openIssues / stats.totalIssues) * 100)}%
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiCheckCircle} boxSize={8} mr={2} color="green.500" />
                <Box>
                  <StatLabel>해결된 이슈</StatLabel>
                  <StatNumber>{stats.resolvedIssues}</StatNumber>
                  <StatHelpText>
                    전체의 {Math.round((stats.resolvedIssues / stats.totalIssues) * 100)}%
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiActivity} boxSize={8} mr={2} color="orange.500" />
                <Box>
                  <StatLabel>긴급 이슈</StatLabel>
                  <StatNumber>{stats.criticalIssues}</StatNumber>
                  <StatHelpText>
                    전체의 {Math.round((stats.criticalIssues / stats.totalIssues) * 100)}%
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* 차트 섹션 */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        {/* 우선순위별 이슈 분포 */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Icon as={FiPieChart} mr={2} />
              <Heading size="md">우선순위별 이슈 분포</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Pie data={priorityChartData} options={chartOptions} />
            </Box>
          </CardBody>
        </Card>

        {/* 부서별 이슈 분포 */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Icon as={FiBarChart2} mr={2} />
              <Heading size="md">부서별 이슈 분포</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Bar data={departmentChartData} options={chartOptions} />
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* 가장 많은 이슈를 보고한 직원 TOP 5 */}
      <Card mb={8}>
        <CardHeader>
          <Flex align="center">
            <Icon as={FiUsers} mr={2} />
            <Heading size="md">가장 많은 이슈를 보고한 직원 TOP 5</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {topWorkers.map((worker) => (
              <Box key={worker.id}>
                <Flex justify="space-between" mb={1}>
                  <HStack>
                    <Text fontWeight="medium">{worker.name}</Text>
                    <Badge colorScheme="purple">{worker.department}</Badge>
                  </HStack>
                  <Text>{worker.count}건 ({worker.percentage}%)</Text>
                </Flex>
                <Progress 
                  value={worker.percentage} 
                  size="sm" 
                  colorScheme="purple" 
                  borderRadius="full" 
                />
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
} 