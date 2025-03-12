'use client';

import { Button, Box, Heading, Text, Container, Center } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function IssuesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류를 로깅하는 서비스에 오류를 보낼 수 있습니다.
    console.error(error);
  }, [error]);

  return (
    <Container maxW="container.xl" py={10}>
      <Center flexDirection="column" textAlign="center">
        <Heading as="h2" size="xl" mb={4}>
          이슈 관리 페이지에 문제가 발생했습니다
        </Heading>
        <Text mb={6} fontSize="lg">
          이슈 관리 페이지를 로드하는 중 오류가 발생했습니다. 불편을 드려 죄송합니다.
        </Text>
        <Box mb={6}>
          <Text color="red.500" fontWeight="bold">
            오류: {error.message || '알 수 없는 오류'}
          </Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={reset}
          size="lg"
        >
          다시 시도
        </Button>
      </Center>
    </Container>
  );
} 