'use client';

import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onMonthSelect: (month: number) => void;
  onFilterApply: () => void;
  onFilterReset: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onMonthSelect,
  onFilterApply,
  onFilterReset,
}) => {
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const activeButtonBg = useColorModeValue('blue.500', 'blue.300');
  const activeButtonColor = useColorModeValue('white', 'gray.800');

  // 현재 선택된 월 계산 (startDate 기준)
  const currentMonth = startDate ? new Date(startDate).getMonth() : -1;

  // 월 이름 배열
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  return (
    <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('white', 'gray.800')}>
      <Text fontWeight="bold" mb={3}>날짜 필터</Text>
      
      {/* 월별 버튼 */}
      <Box mb={4} overflowX="auto">
        <ButtonGroup size="sm" isAttached variant="outline" spacing={0}>
          {months.map((month, index) => (
            <Button
              key={index}
              onClick={() => onMonthSelect(index)}
              bg={currentMonth === index ? activeButtonBg : buttonBg}
              color={currentMonth === index ? activeButtonColor : 'inherit'}
              _hover={{ bg: currentMonth === index ? activeButtonBg : 'gray.200' }}
              borderRadius={0}
              minW="60px"
            >
              {month}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      
      {/* 날짜 범위 선택 */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
        <HStack>
          <Text minW="80px">시작 날짜:</Text>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            size="sm"
          />
        </HStack>
        
        <HStack>
          <Text minW="80px">종료 날짜:</Text>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            size="sm"
          />
        </HStack>
        
        <ButtonGroup size="sm">
          <Button colorScheme="blue" onClick={onFilterApply}>
            적용
          </Button>
          <Button variant="outline" onClick={onFilterReset}>
            초기화
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default DateFilter; 