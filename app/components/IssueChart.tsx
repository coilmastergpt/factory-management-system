'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box } from '@chakra-ui/react';

const data = [
  { name: '월', 이슈수: 4 },
  { name: '화', 이슈수: 3 },
  { name: '수', 이슈수: 7 },
  { name: '목', 이슈수: 5 },
  { name: '금', 이슈수: 6 },
];

export default function IssueChart() {
  return (
    <Box h="300px" w="100%">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="이슈수" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
} 