'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { createIssue } from '../utils/api';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  location: string;
}

interface Props {
  onSuccess?: () => void;
}

export default function CreateIssueForm({ onSuccess }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createIssue({
        ...formData,
        reporterId: 'temp-user-id', // TODO: 실제 로그인한 사용자 ID로 대체
      });
      toast({
        title: '이슈가 생성되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: '',
        location: '',
      });
    } catch (error) {
      toast({
        title: '이슈 생성에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>제목</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="문제의 제목을 입력하세요"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>설명</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="문제에 대한 자세한 설명을 입력하세요"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>우선순위</FormLabel>
          <Select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">낮음</option>
            <option value="MEDIUM">중간</option>
            <option value="HIGH">높음</option>
            <option value="CRITICAL">긴급</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>카테고리</FormLabel>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="예: Inductor, Transformer 등"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>위치</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="문제가 발생한 위치"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          이슈 생성
        </Button>
      </VStack>
    </Box>
  );
} 