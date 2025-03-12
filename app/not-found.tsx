import { Container, Heading, Text, Button, Center, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxW="container.md" py={10}>
      <Center h="70vh">
        <VStack spacing={6} textAlign="center">
          <Heading as="h1" size="2xl">404</Heading>
          <Heading as="h2" size="xl">페이지를 찾을 수 없습니다</Heading>
          <Text fontSize="lg">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </Text>
          <Button as={Link} href="/" colorScheme="blue" size="lg">
            홈으로 돌아가기
          </Button>
        </VStack>
      </Center>
    </Container>
  );
} 