'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  IconButton,
  useToast,
  Badge,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, StarIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { IssueFilter } from '../types/issue';

interface FilterPreset {
  id: string;
  name: string;
  filter: IssueFilter;
  createdAt: string;
}

interface FilterPresetManagerProps {
  currentFilter: IssueFilter;
  onPresetSelect: (filter: IssueFilter) => void;
}

export default function FilterPresetManager({
  currentFilter,
  onPresetSelect,
}: FilterPresetManagerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // 프리셋 목록 불러오기
  const fetchPresets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/filter-presets');
      if (!response.ok) throw new Error('프리셋을 불러오는데 실패했습니다.');
      
      const data = await response.json();
      setPresets(data);
    } catch (error) {
      console.error('프리셋 불러오기 오류:', error);
      toast({
        title: '프리셋 불러오기 실패',
        description: '필터 프리셋을 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 새 프리셋 저장
  const savePreset = async () => {
    try {
      if (!newPresetName.trim()) {
        toast({
          title: '이름 필수',
          description: '프리셋 이름을 입력해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);
      const response = await fetch('/api/filter-presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPresetName,
          filter: currentFilter,
        }),
      });

      if (!response.ok) throw new Error('프리셋 저장에 실패했습니다.');
      
      const newPreset = await response.json();
      setPresets([...presets, newPreset]);
      
      toast({
        title: '프리셋 저장 성공',
        description: '필터 프리셋이 저장되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setNewPresetName('');
      onClose();
    } catch (error) {
      console.error('프리셋 저장 오류:', error);
      toast({
        title: '프리셋 저장 실패',
        description: '필터 프리셋을 저장하는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 프리셋 삭제
  const deletePreset = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/filter-presets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('프리셋 삭제에 실패했습니다.');
      
      setPresets(presets.filter(preset => preset.id !== id));
      
      toast({
        title: '프리셋 삭제 성공',
        description: '필터 프리셋이 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('프리셋 삭제 오류:', error);
      toast({
        title: '프리셋 삭제 실패',
        description: '필터 프리셋을 삭제하는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 프리셋 선택
  const selectPreset = (filter: IssueFilter) => {
    onPresetSelect(filter);
  };

  // 컴포넌트 마운트 시 프리셋 목록 불러오기
  useEffect(() => {
    fetchPresets();
  }, []);

  // 필터 요약 텍스트 생성
  const getFilterSummary = (filter: IssueFilter) => {
    const parts = [];
    if (filter.status) parts.push(`상태: ${filter.status}`);
    if (filter.priority) parts.push(`우선순위: ${filter.priority}`);
    if (filter.department) parts.push(`부서: ${filter.department}`);
    if (filter.search) parts.push(`검색: ${filter.search}`);
    
    return parts.length > 0 ? parts.join(', ') : '기본 필터';
  };

  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="outline">
          필터 프리셋
        </MenuButton>
        <MenuList>
          {presets.length === 0 ? (
            <MenuItem isDisabled>저장된 프리셋 없음</MenuItem>
          ) : (
            presets.map(preset => (
              <MenuItem 
                key={preset.id} 
                onClick={() => selectPreset(preset.filter)}
                closeOnSelect
              >
                <Flex justifyContent="space-between" width="100%" alignItems="center">
                  <Text>{preset.name}</Text>
                  <IconButton
                    aria-label="프리셋 삭제"
                    icon={<DeleteIcon />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                  />
                </Flex>
              </MenuItem>
            ))
          )}
          <MenuItem 
            icon={<AddIcon />} 
            onClick={onOpen}
            closeOnSelect
          >
            현재 필터 저장
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>필터 프리셋 저장</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2}>현재 필터:</Text>
                <Badge p={2} borderRadius="md" bg="gray.100" color="gray.800">
                  {getFilterSummary(currentFilter)}
                </Badge>
              </Box>
              
              <Input
                placeholder="프리셋 이름"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={savePreset}
              isLoading={loading}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 