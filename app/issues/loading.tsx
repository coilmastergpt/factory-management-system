import { Container, Center, Spinner, Text, VStack } from '@chakra-ui/react';

export default function IssuesLoading() {
  return (
    <Container maxW="container.xl" py={10}>
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text fontSize="lg" fontWeight="medium">이슈 데이터를 불러오는 중...</Text>
        </VStack>
      </Center>
    </Container>
  );
} 