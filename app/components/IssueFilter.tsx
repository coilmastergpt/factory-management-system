'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  Select,
  Input,
  IconButton,
  HStack,
  Button,
  useDisclosure,
  Collapse,
  VStack,
  Text,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { IssueFilter, IssueSort } from '../types/issue';

interface IssueFilterProps {
  filter: IssueFilter;
  onFilterChange: (filter: IssueFilter) => void;
  onSearch: () => void;
}

export default function IssueFilterComponent({
  filter,
  onFilterChange,
  onSearch,
}: IssueFilterProps) {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [tempFilter, setTempFilter] = useState<IssueFilter>(filter);
  const [workers, setWorkers] = useState<{id: string, name: string, companyId: string}[]>([]);
  const [issueTypes, setIssueTypes] = useState<{id: string, name: string, value: string}[]>([]);

  // 설정 데이터 가져오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('설정 데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setWorkers(data.workers || []);
        setIssueTypes(data.issueTypes || []);
      } catch (error) {
        console.error('설정 데이터 불러오기 오류:', error);
        toast({
          title: '데이터 로딩 실패',
          description: '설정 데이터를 불러오는데 실패했습니다.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    fetchSettings();
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string) => {
    const newFilter = {
      ...tempFilter,
      [key]: value === '전체' ? undefined : value,
    };
    setTempFilter(newFilter);
  };

  // 필터 적용
  const applyFilter = () => {
    onFilterChange(tempFilter);
    onSearch();
  };

  // 필터 초기화
  const resetFilter = () => {
    const emptyFilter: IssueFilter = {};
    setTempFilter(emptyFilter);
    onFilterChange(emptyFilter);
    onSearch();
  };

  return (
    <Box mb={6} p={4} bg="gray.50" borderRadius="md" shadow="sm">
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontWeight="medium" fontSize="sm">
          필터
          {Object.keys(filter).some(key => filter[key as keyof IssueFilter]) && (
            <Badge ml={2} colorScheme="blue">
              활성
            </Badge>
          )}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={onToggle}
        >
          {isOpen ? '접기' : '펼치기'}
        </Button>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={4} align="stretch" mt={2}>
          <HStack spacing={4} wrap="wrap">
            <FormControl w="auto">
              <Select
                size="sm"
                value={tempFilter.status || '전체'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="전체">모든 상태</option>
                <option value="OPEN">대기중</option>
                <option value="IN_PROGRESS">진행중</option>
                <option value="RESOLVED">해결됨</option>
                <option value="CLOSED">종료</option>
              </Select>
            </FormControl>

            <FormControl w="auto">
              <Select
                size="sm"
                value={tempFilter.priority || '전체'}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="전체">모든 우선순위</option>
                <option value="LOW">낮음</option>
                <option value="MEDIUM">중간</option>
                <option value="HIGH">높음</option>
                <option value="CRITICAL">긴급</option>
              </Select>
            </FormControl>

            <FormControl w="auto">
              <Select
                size="sm"
                value={tempFilter.department || '전체'}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="전체">모든 부서</option>
                <option value="생산">생산</option>
                <option value="품질">품질</option>
                <option value="유지보수">유지보수</option>
                <option value="안전">안전</option>
              </Select>
            </FormControl>
            
            <FormControl w="auto">
              <Select
                size="sm"
                value={tempFilter.issueType || '전체'}
                onChange={(e) => handleFilterChange('issueType', e.target.value)}
              >
                <option value="전체">모든 문제 유형</option>
                {issueTypes.map(type => (
                  <option key={type.id} value={type.value}>{type.name}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl w="auto">
              <Select
                size="sm"
                value={tempFilter.createdById || '전체'}
                onChange={(e) => handleFilterChange('createdById', e.target.value)}
              >
                <option value="전체">모든 작업자</option>
                {workers.map(worker => (
                  <option key={worker.id} value={worker.id}>{worker.name} ({worker.companyId})</option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <Divider />

          <Flex>
            <Input
              size="sm"
              placeholder="이슈 검색..."
              value={tempFilter.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              mr={2}
            />
            <Button size="sm" colorScheme="blue" onClick={applyFilter}>
              적용
            </Button>
            <Button size="sm" variant="ghost" ml={2} onClick={resetFilter}>
              초기화
            </Button>
          </Flex>
        </VStack>
      </Collapse>

      {!isOpen && (
        <Flex mt={2}>
          <Input
            size="sm"
            placeholder="이슈 검색..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          />
          <IconButton
            aria-label="검색"
            icon={<SearchIcon />}
            size="sm"
            ml={2}
            onClick={onSearch}
          />
        </Flex>
      )}
    </Box>
  );
} 