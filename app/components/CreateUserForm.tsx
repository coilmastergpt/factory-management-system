'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { createUser } from '../utils/api';

type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface FormData {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  companyId: string;
}

interface Department {
  id: string;
  name: string;
  value: string;
}

interface Props {
  onSuccess?: () => void;
}

export default function CreateUserForm({ onSuccess }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'MANAGER',
    department: '',
    companyId: '',
  });

  // 부서 목록 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // 상대 경로로 API 호출
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('부서 목록을 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        console.log('설정 데이터:', data); // 디버깅용 로그
        setDepartments(data.departments || []);
      } catch (error) {
        console.error('부서 목록 가져오기 오류:', error);
        // 오류 발생 시 기본 부서 목록 설정
        setDepartments([
          { id: 'dept-1', name: '생산', value: '생산' },
          { id: 'dept-2', name: '품질', value: '품질' },
          { id: 'dept-3', name: '유지보수', value: '유지보수' },
          { id: 'dept-4', name: '안전', value: '안전' },
        ]);
        toast({
          title: '부서 목록을 불러오는데 실패했습니다.',
          description: '기본 부서 목록을 사용합니다.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchDepartments();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUser(formData);
      toast({
        title: '관리자가 등록되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      setFormData({
        name: '',
        email: '',
        role: 'MANAGER',
        department: '',
        companyId: '',
      });
    } catch (error) {
      toast({
        title: '관리자 등록에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>이름</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="관리자 이름"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>직원 ID</FormLabel>
          <Input
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            placeholder="직원 ID (예: EMP001)"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>이메일</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@factory.com"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>부서</FormLabel>
          {departments.length > 0 ? (
            <Select 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              placeholder="부서 선택"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.value}>
                  {dept.name}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="부서 입력"
            />
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          관리자 등록
        </Button>
      </VStack>
    </Box>
  );
} 