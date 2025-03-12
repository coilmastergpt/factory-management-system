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
  Text,
  HStack,
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

interface Worker {
  id: string;
  name: string;
  companyId: string;
  email: string;
  department: string;
  role: string;
}

interface Props {
  onUserCreated?: () => void;
}

export default function CreateUserForm({ onUserCreated }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]); // 모든 작업자 목록
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
    fetchAllWorkers(); // 모든 작업자 데이터 로딩
  }, [toast]);

  // 모든 작업자 데이터 로딩
  const fetchAllWorkers = async () => {
    try {
      // 관리자 데이터
      const usersResponse = await fetch('/api/users');
      const users = await usersResponse.json();
      
      // 작업자 데이터
      const workersResponse = await fetch('/api/settings?type=workers');
      const workers = await workersResponse.json();
      
      // 두 데이터 합치기
      const combinedWorkers = [
        ...users,
        ...workers.map((worker: any) => ({
          id: worker.id,
          name: worker.name,
          companyId: worker.companyId || '',
          email: worker.email,
          department: worker.department,
          role: worker.role
        }))
      ];
      
      // 중복 제거 (companyId 기준)
      const uniqueWorkers = combinedWorkers.filter((worker, index, self) => 
        worker.companyId && 
        self.findIndex(w => w.companyId === worker.companyId) === index
      );
      
      setAllWorkers(uniqueWorkers);
    } catch (error) {
      console.error('모든 작업자 데이터 로딩 오류:', error);
    }
  };

  // 직원 ID로 이름 찾기
  const findWorkerNameById = (companyId: string) => {
    const worker = allWorkers.find(w => w.companyId === companyId);
    return worker ? worker.name : '';
  };

  // 이름으로 직원 ID 찾기
  const findWorkerIdByName = (name: string) => {
    const worker = allWorkers.find(w => w.name === name);
    return worker ? worker.companyId : '';
  };

  // 직원 ID로 작업자 정보 찾기
  const findWorkerByCompanyId = (companyId: string) => {
    return allWorkers.find(w => w.companyId === companyId);
  };

  // 이름으로 작업자 정보 찾기
  const findWorkerByName = (name: string) => {
    return allWorkers.find(w => w.name === name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 직원 ID가 작업자 관리에 등록되어 있는지 확인
    const isWorkerRegistered = allWorkers.some(worker => worker.companyId === formData.companyId);
    
    if (!isWorkerRegistered) {
      toast({
        title: '등록되지 않은 직원 ID',
        description: '해당 직원 ID는 작업자 관리에 등록되어 있지 않습니다. 먼저 설정의 작업자 관리에서 등록해주세요.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <Box p={3} bg="orange.100" borderRadius="md" color="orange.800">
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">등록되지 않은 직원 ID</Text>
              <Text>해당 직원 ID는 작업자 관리에 등록되어 있지 않습니다.</Text>
              <HStack spacing={2} mt={2}>
                <Button size="sm" colorScheme="orange" onClick={() => {
                  onClose();
                  window.location.href = '/settings?tab=workers';
                }}>
                  작업자 관리로 이동
                </Button>
                <Button size="sm" variant="ghost" onClick={onClose}>
                  닫기
                </Button>
              </HStack>
            </VStack>
          </Box>
        )
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await createUser(formData);
      toast({
        title: '관리자가 등록되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUserCreated?.();
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

  // 직원 ID 변경 시 이름과 이메일 자동 설정
  const handleCompanyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const companyId = e.target.value;
    setFormData({...formData, companyId});
    
    // 직원 ID로 작업자 정보 찾기
    if (companyId) {
      const worker = findWorkerByCompanyId(companyId);
      if (worker) {
        // 이름과 이메일 자동 설정
        setFormData(prev => ({
          ...prev, 
          name: worker.name || prev.name,
          email: worker.email || prev.email,
          department: worker.department || prev.department
        }));
      }
    }
  };

  // 이름 변경 시 직원 ID와 이메일 자동 설정
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({...formData, name});
    
    // 이름으로 작업자 정보 찾기
    if (name) {
      const worker = findWorkerByName(name);
      if (worker) {
        // 직원 ID와 이메일 자동 설정
        setFormData(prev => ({
          ...prev, 
          companyId: worker.companyId || prev.companyId,
          email: worker.email || prev.email,
          department: worker.department || prev.department
        }));
      }
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
            onChange={handleNameChange}
            placeholder="관리자 이름"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>직원 ID</FormLabel>
          <Input
            name="companyId"
            value={formData.companyId}
            onChange={handleCompanyIdChange}
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