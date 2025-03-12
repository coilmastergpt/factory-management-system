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
  Grid,
  GridItem,
  Divider,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiActivity, FiUsers, FiPieChart, FiBarChart2, FiCalendar, FiAward, FiList, FiClock as FiClockCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js 등록
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Title,
  ChartDataLabels
);

// 간소화된 인터페이스
interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
  issuesByPriority: Record<string, number>;
  issuesByDepartment: Record<string, number>;
  issuesByDay: Record<string, number>;
  topReporters: Array<{
    id: string;
    name: string;
    department: string;
    count: number;
    percentage: number;
  }>;
  topResolvers: Array<{
    id: string;
    name: string;
    department: string;
    count: number;
    percentage: number;
  }>;
  managerWorkload: Array<{
    id: string;
    name: string;
    department: string;
    assignedCount: number;
    resolvedCount: number;
    pendingCount: number;
  }>;
  byPriority?: {
    priority: string;
    label: string;
    count: number;
    color: string;
  }[];
  byDepartment?: {
    department: string;
    count: number;
  }[];
  byDate?: {
    date: string;
    count: number;
  }[];
  recentImportantIssues?: {
    id: string;
    title: string;
    priority: string;
    department: string;
    status: string;
    createdAt: string;
  }[];
  averageResolutionTime?: number;
}

export default function DashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    month: ''
  });

  // 통계 데이터 가져오기
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // 날짜 필터 추가
      const queryParams = new URLSearchParams();
      
      if (dateFilter.startDate) {
        queryParams.append('startDate', dateFilter.startDate);
      }
      if (dateFilter.endDate) {
        queryParams.append('endDate', dateFilter.endDate);
      }
      if (dateFilter.month) {
        queryParams.append('month', dateFilter.month);
      }
      
      const response = await fetch(`/api/dashboard/stats?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('대시보드 통계를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('대시보드 통계 불러오기 오류:', error);
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

  // 컴포넌트 마운트 시 통계 데이터 불러오기
  useEffect(() => {
    fetchDashboardStats();
  }, [dateFilter]);

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

  // 우선순위별 이슈 분포 차트 데이터
  const priorityChartData = {
    labels: Object.keys(stats.issuesByPriority).map(key => {
      switch(key) {
        case 'LOW': return '낮음';
        case 'MEDIUM': return '중간';
        case 'HIGH': return '높음';
        case 'CRITICAL': return '긴급';
        default: return key;
      }
    }),
    datasets: [
      {
        data: Object.values(stats.issuesByPriority),
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
    labels: Object.keys(stats.issuesByDepartment),
    datasets: [
      {
        label: '이슈 수',
        data: Object.values(stats.issuesByDepartment),
        backgroundColor: 'rgba(66, 153, 225, 0.8)',
        borderColor: 'rgb(66, 153, 225)',
        borderWidth: 1,
      },
    ],
  };

  // 일별 이슈 건수 차트 데이터
  const dateChartData = {
    labels: Object.keys(stats.issuesByDay).map(date => {
      const dateParts = date.split('-');
      return `${dateParts[1]}/${dateParts[2]}`;
    }),
    datasets: [
      {
        label: '일별 이슈 건수',
        data: Object.values(stats.issuesByDay),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // 매니저 워크로드 차트 데이터
  const managerWorkload = stats.managerWorkload || [];
  const managerWorkloadChartData = {
    labels: managerWorkload.map(manager => manager.name),
    datasets: [
      {
        label: '할당된 이슈',
        data: managerWorkload.map(manager => manager.assignedCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '해결된 이슈',
        data: managerWorkload.map(manager => manager.resolvedCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '대기 중인 이슈',
        data: managerWorkload.map(manager => manager.pendingCount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += context.parsed + '건';
            } else if (context.raw !== undefined) {
              label += context.raw + '건';
            }
            return label;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold' as const
        },
        formatter: (value: number) => {
          return value > 0 ? value + '건' : '';
        }
      }
    },
  };

  // 파이 차트 옵션
  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold' as const
        },
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return value > 0 ? `${value}건 (${percentage}%)` : '';
        }
      }
    }
  };

  // 바 차트 옵션
  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      datalabels: {
        display: true,
        color: '#fff',
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => {
          return value > 0 ? value + '건' : '';
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // 라인 차트 옵션
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: '최근 14일간 이슈 발생 추이'
      },
      datalabels: {
        display: true,
        color: '#36A2EB',
        align: 'top' as const,
        formatter: (value: number) => {
          return value > 0 ? value + '건' : '';
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 시간 형식 변환 (분 -> 시간:분)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">대시보드</Heading>
        
        {/* 날짜 필터 추가 */}
        <Flex gap={4} alignItems="center">
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
            onClick={fetchDashboardStats}
            mt="auto"
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
            mt="auto"
          >
            초기화
          </Button>
        </Flex>
      </Flex>
      
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
                    전체의 {Math.round((stats.openIssues / stats.totalIssues) * 100) || 0}%
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
                    전체의 {Math.round((stats.resolvedIssues / stats.totalIssues) * 100) || 0}%
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
                <Icon as={FiClockCircle} boxSize={8} mr={2} color="purple.500" />
                <Box>
                  <StatLabel>평균 해결 시간</StatLabel>
                  <StatNumber>{stats.averageResolutionTime ? formatTime(stats.averageResolutionTime) : '-'}</StatNumber>
                  <StatHelpText>
                    해결된 이슈 기준
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
              <Pie data={priorityChartData} options={pieChartOptions} />
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
              <Bar data={departmentChartData} options={barChartOptions} />
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* 일별 이슈 건수 차트 */}
      <Card mb={8}>
        <CardHeader>
          <Flex align="center">
            <Icon as={FiCalendar} mr={2} />
            <Heading size="md">일별 이슈 건수</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box h="300px">
            <Line data={dateChartData} options={lineChartOptions} />
          </Box>
        </CardBody>
      </Card>
      
      {/* 매니저 워크로드 비교 */}
      {managerWorkload.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">매니저별 워크로드 비교</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Bar data={managerWorkloadChartData} options={barChartOptions} />
            </Box>
          </CardBody>
        </Card>
      )}

      {/* 매니저 워크로드 상세 테이블 */}
      {managerWorkload.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">매니저별 업무 현황</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>매니저</Th>
                  <Th>부서</Th>
                  <Th>할당된 이슈</Th>
                  <Th>해결된 이슈</Th>
                  <Th>대기 중인 이슈</Th>
                  <Th>처리율</Th>
                </Tr>
              </Thead>
              <Tbody>
                {managerWorkload.map((manager) => (
                  <Tr key={manager.id}>
                    <Td fontWeight="bold">{manager.name}</Td>
                    <Td>{manager.department}</Td>
                    <Td isNumeric>{manager.assignedCount}건</Td>
                    <Td isNumeric>{manager.resolvedCount}건</Td>
                    <Td isNumeric>{manager.pendingCount}건</Td>
                    <Td>
                      <Flex align="center">
                        <Progress 
                          value={manager.assignedCount > 0 ? (manager.resolvedCount / manager.assignedCount) * 100 : 0} 
                          size="sm" 
                          colorScheme="green" 
                          flex="1" 
                          mr={2}
                        />
                        <Text fontSize="sm">
                          {manager.assignedCount > 0 
                            ? `${((manager.resolvedCount / manager.assignedCount) * 100).toFixed(1)}%` 
                            : '0%'}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}
      
      {/* 이슈 보고자 및 해결자 통계 */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        {/* 가장 많은 이슈를 보고한 직원 TOP 5 */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Icon as={FiUsers} mr={2} />
              <Heading size="md">가장 많은 이슈를 보고한 직원 TOP 5</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {stats.topReporters && stats.topReporters.length > 0 ? (
                stats.topReporters.map((reporter) => (
                  <Box key={reporter.id}>
                    <Flex justify="space-between" mb={1}>
                      <HStack>
                        <Text fontWeight="medium">{reporter.name}</Text>
                        <Badge colorScheme="purple">{reporter.department}</Badge>
                      </HStack>
                      <Text>{reporter.count}건 ({reporter.percentage.toFixed(1)}%)</Text>
                    </Flex>
                    <Progress 
                      value={reporter.percentage} 
                      size="sm" 
                      colorScheme="purple" 
                      borderRadius="full" 
                    />
                  </Box>
                ))
              ) : (
                <Text>보고된 이슈가 없습니다.</Text>
              )}
            </VStack>
          </CardBody>
        </Card>
        
        {/* 가장 많은 이슈를 해결한 매니저/관리자 TOP 5 */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Icon as={FiAward} mr={2} />
              <Heading size="md">가장 많은 이슈를 해결한 매니저/관리자 TOP 5</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {stats.topResolvers && stats.topResolvers.length > 0 ? (
                stats.topResolvers.map((resolver) => (
                  <Box key={resolver.id}>
                    <Flex justify="space-between" mb={1}>
                      <HStack>
                        <Text fontWeight="medium">{resolver.name}</Text>
                        <Badge colorScheme="green">{resolver.department}</Badge>
                      </HStack>
                      <Text>{resolver.count}건 ({resolver.percentage.toFixed(1)}%)</Text>
                    </Flex>
                    <Progress 
                      value={resolver.percentage} 
                      size="sm" 
                      colorScheme="green" 
                      borderRadius="full" 
                    />
                  </Box>
                ))
              ) : (
                <Text>해결된 이슈가 없습니다.</Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* 최근 주요 이슈 */}
      <Card mb={8}>
        <CardHeader>
          <Flex align="center">
            <Icon as={FiList} mr={2} />
            <Heading size="md">최근 주요 이슈</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>제목</Th>
                  <Th>부서</Th>
                  <Th>우선순위</Th>
                  <Th>등록일</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.recentImportantIssues && stats.recentImportantIssues.length > 0 ? (
                  stats.recentImportantIssues.map((issue) => (
                    <Tr key={issue.id}>
                      <Td fontWeight="medium">{issue.title}</Td>
                      <Td>{issue.department}</Td>
                      <Td>
                        <Badge colorScheme={getPriorityColor(issue.priority)}>
                          {issue.priority === 'LOW' ? '낮음' : 
                           issue.priority === 'MEDIUM' ? '중간' : 
                           issue.priority === 'HIGH' ? '높음' : '긴급'}
                        </Badge>
                      </Td>
                      <Td>{formatDate(issue.createdAt)}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center">주요 이슈가 없습니다.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Container>
  );
} 