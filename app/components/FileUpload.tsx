import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';

interface Props {
  issueId: string;
  onUploadSuccess: () => void;
}

export default function FileUpload({ issueId, onUploadSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/issues/${issueId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('파일 업로드에 실패했습니다.');

      toast({
        title: '업로드 성공',
        description: '파일이 업로드되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onUploadSuccess();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '파일 업로드에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
        display="none"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        isLoading={isUploading}
        colorScheme="blue"
      >
        파일 선택
      </Button>
    </VStack>
  );
} 