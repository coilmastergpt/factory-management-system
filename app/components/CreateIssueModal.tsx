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
  Box,
  Flex,
  Text,
  HStack,
  IconButton,
  Image,
  Progress,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useFileUpload } from './FileUploadHelper';

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
  
  // 파일 업로드 관련 상태 및 기능
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadFiles, formatFileSize } = useFileUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // 먼저 파일 업로드
      let attachments: Array<{
        url: string;
        name: string;
        size: number;
        type: string;
      }> = [];
      
      if (selectedFiles.length > 0) {
        // File[]를 FileList로 변환
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        attachments = await uploadFiles(dataTransfer.files);
      }
      
      // 이슈 생성 요청
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          reporterId: user.id,
          attachments: attachments.length > 0 ? attachments : undefined,
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
      
      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        status: 'OPEN',
        priority: 'MEDIUM',
        category: '',
        location: '',
      });
      setSelectedFiles([]);
      
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
  
  // 파일 선택 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };
  
  // 선택된 파일 제거
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // 파일 선택 버튼 클릭
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
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
              
              {/* 파일 업로드 섹션 */}
              <FormControl>
                <FormLabel>첨부 파일</FormLabel>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  multiple
                  accept="image/*,video/*"
                />
                <Button
                  leftIcon={<AddIcon />}
                  onClick={handleFileButtonClick}
                  size="sm"
                  mb={2}
                  isDisabled={uploading}
                >
                  파일 추가
                </Button>
                
                {uploading && (
                  <Box mt={2} mb={2}>
                    <Text mb={1}>파일 업로드 중...</Text>
                    <Progress size="sm" isIndeterminate colorScheme="blue" />
                  </Box>
                )}
                
                {selectedFiles.length > 0 && (
                  <Box mt={2} borderWidth="1px" borderRadius="md" p={2}>
                    <Text mb={2} fontWeight="bold">선택된 파일 ({selectedFiles.length}개)</Text>
                    <VStack align="stretch" spacing={2}>
                      {selectedFiles.map((file, index) => (
                        <Flex key={index} justify="space-between" align="center">
                          <HStack>
                            {file.type.startsWith('image/') && (
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                boxSize="40px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            )}
                            <Box>
                              <Text fontSize="sm" noOfLines={1}>{file.name}</Text>
                              <Text fontSize="xs" color="gray.500">{formatFileSize(file.size)}</Text>
                            </Box>
                          </HStack>
                          <IconButton
                            aria-label="파일 제거"
                            icon={<CloseIcon />}
                            size="xs"
                            onClick={() => handleRemoveFile(index)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading || uploading}
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