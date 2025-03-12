'use client';

import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from '@chakra-ui/react';

const mockStats = [
  {
    label: '전체 이슈',
    number: '42',
    helpText: '지난 달 대비 +12%',
  },
  {
    label: '해결된 이슈',
    number: '28',
    helpText: '해결률 66%',
  },
  {
    label: '긴급 이슈',
    number: '5',
    helpText: '즉시 조치 필요',
  },
  {
    label: '평균 해결 시간',
    number: '4.2h',
    helpText: '지난 주 대비 -30min',
  },
];

export default function DashboardStats() {
  return (
    <>
      {mockStats.map((stat, index) => (
        <Box
          key={index}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <Stat>
            <StatLabel fontSize="sm" color="gray.500">
              {stat.label}
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold">
              {stat.number}
            </StatNumber>
            <StatHelpText>{stat.helpText}</StatHelpText>
          </Stat>
        </Box>
      ))}
    </>
  );
} 