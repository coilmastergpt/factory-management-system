'use client';

import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Box,
} from '@chakra-ui/react';
import { format } from 'date-fns';

// 임시 데이터
const mockIssues = [
  {
    id: '1',
    title: 'Inductor 권선기 이상',
    status: 'OPEN',
    priority: 'HIGH',
    reporter: '김철수',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Transformer 코어 불량',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    reporter: '박영희',
    createdAt: new Date(),
  },
];

const statusColors = {
  OPEN: 'red',
  IN_PROGRESS: 'yellow',
  RESOLVED: 'green',
  CLOSED: 'gray',
};

const priorityColors = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  CRITICAL: 'red',
};

export default function IssueList() {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>제목</Th>
            <Th>상태</Th>
            <Th>우선순위</Th>
            <Th>보고자</Th>
            <Th>생성일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mockIssues.map((issue) => (
            <Tr key={issue.id}>
              <Td>{issue.title}</Td>
              <Td>
                <Badge colorScheme={statusColors[issue.status]}>
                  {issue.status}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={priorityColors[issue.priority]}>
                  {issue.priority}
                </Badge>
              </Td>
              <Td>{issue.reporter}</Td>
              <Td>{format(issue.createdAt, 'yyyy-MM-dd HH:mm')}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
} 