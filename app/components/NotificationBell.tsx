import {
  IconButton,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  issueId?: string;
  commentId?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const toast = useToast();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('알림을 불러오는데 실패했습니다.');
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '알림을 불러오는데 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // 읽음 처리
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: [notification.id],
        }),
      });

      // 알림 목록 갱신
      setNotifications(notifications.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);

      // 해당 이슈로 이동
      if (notification.issueId) {
        router.push(`/issues/${notification.issueId}`);
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '알림 읽음 처리에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="알림"
            icon={<BellIcon />}
            variant="ghost"
            size="lg"
            color="black"
            borderWidth="1px"
            borderColor="brand.200"
            _hover={{ bg: 'brand.50', borderColor: 'brand.300', color: 'black' }}
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="400px">
        <PopoverBody py={4}>
          <VStack align="stretch" spacing={3}>
            {notifications.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                알림이 없습니다.
              </Text>
            ) : (
              notifications.map(notification => (
                <HStack
                  key={notification.id}
                  p={3}
                  borderWidth={1}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => handleNotificationClick(notification)}
                  bg={notification.isRead ? 'white' : 'blue.50'}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Box flex={1}>
                    <Text>{notification.content}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                  {!notification.isRead && (
                    <Badge colorScheme="blue">새 알림</Badge>
                  )}
                </HStack>
              ))
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
} 