'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  Button,
  Divider,
  Flex,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Comment } from '../types/issue';

interface CommentSectionProps {
  issueId: string;
  comments?: Comment[];
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function CommentSection({ issueId, comments: externalComments, setComments: setExternalComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/issues/${issueId}/comments`);
      if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.');
      
      const data = await response.json();
      setComments(data);
      if (setExternalComments) {
        setExternalComments(data);
      }
    } catch (error) {
      console.error('댓글 불러오기 오류:', error);
      toast({
        title: '댓글 불러오기 실패',
        description: '댓글을 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 새 댓글 작성
  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.');
      
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
      
      toast({
        title: '댓글 작성 성공',
        description: '댓글이 작성되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      toast({
        title: '댓글 작성 실패',
        description: '댓글 작성에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 컴포넌트 마운트 시 댓글 불러오기
  useEffect(() => {
    if (!externalComments) {
      fetchComments();
    } else {
      setComments(externalComments);
      setLoading(false);
    }
  }, [issueId, externalComments]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        댓글
      </Text>
      
      {loading ? (
        <Center py={4}>
          <Spinner />
        </Center>
      ) : comments.length === 0 ? (
        <Text color="gray.500" py={4}>
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch" mb={6}>
          {comments.map((comment) => (
            <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md">
              <HStack spacing={4} mb={2}>
                <Avatar size="sm" name={comment.author.name} />
                <Box>
                  <Text fontWeight="bold">{comment.author.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(comment.createdAt)}
                  </Text>
                </Box>
              </HStack>
              <Text whiteSpace="pre-wrap">{comment.content}</Text>
            </Box>
          ))}
        </VStack>
      )}
      
      <Divider my={4} />
      
      <Flex>
        <Input
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          mr={2}
        />
        <Button
          colorScheme="blue"
          onClick={submitComment}
          isLoading={submitting}
          isDisabled={!newComment.trim()}
        >
          작성
        </Button>
      </Flex>
    </Box>
  );
} 