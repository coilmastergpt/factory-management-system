'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateIssueModal({ isOpen, onClose, onSuccess }: CreateIssueModalProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          reporterId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('이슈 생성에 실패했습니다.');
      }

      toast({
        title: '이슈가 생성되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setFormData({
        title: '',
        description: '',
        status: 'OPEN',
        priority: 'MEDIUM',
        category: '',
        location: '',
      });
      
      onSuccess();
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>이슈 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>제목</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="이슈 제목을 입력하세요"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>설명</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="이슈에 대한 자세한 설명을 입력하세요"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>상태</FormLabel>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="OPEN">대기중</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="RESOLVED">해결됨</option>
                  <option value="CLOSED">종료</option>
                </Select>
              </FormControl>

              <FormControl>
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
                  placeholder="이슈 카테고리를 입력하세요"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>위치</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="이슈가 발생한 위치를 입력하세요"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                생성
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 