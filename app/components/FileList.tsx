import {
  Box,
  VStack,
  HStack,
  Text,
  Link,
  Icon,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

interface Attachment {
  id: string;
  filename: string;
  url: string;
  createdAt: string;
}

interface Props {
  issueId: string;
}

export default function FileList({ issueId }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    fetchAttachments();
  }, [issueId]);

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/api/issues/${issueId}/attachments`);
      if (!response.ok) throw new Error('첨부 파일 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setAttachments(data);
    } catch (error) {
      console.error('첨부 파일 목록 조회 중 오류 발생:', error);
    }
  };

  if (attachments.length === 0) {
    return null;
  }

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="bold" mb={2}>첨부 파일</Text>
      {attachments.map(attachment => (
        <HStack key={attachment.id} spacing={2} p={2} borderWidth={1} borderRadius="md">
          <Icon as={AttachmentIcon} />
          <Link href={attachment.url} isExternal>
            {attachment.filename}
          </Link>
        </HStack>
      ))}
    </VStack>
  );
} 