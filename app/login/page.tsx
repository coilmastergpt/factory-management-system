'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호가 4자리 숫자인지 확인
    if (!/^\d{4}$/.test(password)) {
      toast({
        title: '비밀번호 오류',
        description: '비밀번호는 4자리 숫자여야 합니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      await login(username, password);
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: '사용자 이름과 비밀번호를 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Heading size="lg" mb={6} textAlign="center">공장 관리 시스템</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>사용자 이름</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자 이름을 입력하세요"
            />
          </FormControl>
          <FormControl>
            <FormLabel>비밀번호 (4자리)</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4자리 비밀번호"
              maxLength={4}
              pattern="\d{4}"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              비밀번호는 4자리 숫자만 입력 가능합니다.
            </Text>
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            로그인
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 