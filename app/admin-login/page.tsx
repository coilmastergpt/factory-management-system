'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Code,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<string | null>(null);

  // 이미 로그인한 경우 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      setUserInfo(JSON.stringify(user, null, 2));
    }
  }, [user]);

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/admin-login');
      
      if (!response.ok) {
        throw new Error('관리자 로그인에 실패했습니다.');
      }
      
      const data = await response.json();
      
      toast({
        title: '로그인 성공',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 페이지 새로고침하여 AuthContext가 쿠키에서 사용자 정보를 읽도록 함
      window.location.href = '/settings';
    } catch (error) {
      console.error('관리자 로그인 오류:', error);
      toast({
        title: '로그인 실패',
        description: '관리자 로그인 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={6} align="center">
        <Heading>관리자 로그인</Heading>
        <Text>이 페이지는 테스트 목적으로 관리자 권한으로 직접 로그인할 수 있는 페이지입니다.</Text>
        <Box w="100%" p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
          <Button
            colorScheme="red"
            size="lg"
            width="full"
            onClick={handleAdminLogin}
            isLoading={isLoading}
          >
            관리자로 로그인
          </Button>
        </Box>
        
        {userInfo && (
          <Box w="100%" p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
            <Heading size="sm" mb={2}>현재 사용자 정보:</Heading>
            <Code p={2} borderRadius="md" w="100%" display="block" whiteSpace="pre-wrap">
              {userInfo}
            </Code>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 