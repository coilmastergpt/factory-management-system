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
} from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          안녕하세요, {user.name}님!
        </Heading>
        <Text color="gray.600">
          오늘도 좋은 하루 되세요.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">이슈 현황</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>처리 대기</StatLabel>
              <StatNumber>3건</StatNumber>
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
              <StatNumber>12명</StatNumber>
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
              <StatNumber>{user.department}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  );
} 