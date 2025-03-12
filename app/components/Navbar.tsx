'use client';

import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { HiHome, HiClipboardList, HiUserGroup, HiChevronDown, HiCog } from 'react-icons/hi';
import NextLink from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactElement;
}

const NavLink = ({ href, children, icon }: NavLinkProps) => (
  <Link
    as={NextLink}
    href={href}
    px={4}
    py={2}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.100', 'gray.700'),
    }}
    display="flex"
    alignItems="center"
    gap={2}
  >
    {icon}
    {children}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.900');

  if (!user) {
    return null;
  }

  return (
    <Box bg={bgColor} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Text fontSize="xl" fontWeight="bold">
            공장관리시스템
          </Text>
          <HStack as="nav" spacing={4}>
            <NavLink href="/dashboard" icon={<HiHome />}>
              대시보드
            </NavLink>
            <NavLink href="/issues" icon={<HiClipboardList />}>
              이슈관리
            </NavLink>
            <NavLink href="/settings" icon={<HiCog />}>
              설정
            </NavLink>
            {user.role === 'ADMIN' && (
              <NavLink href="/users" icon={<HiUserGroup />}>
                사용자관리
              </NavLink>
            )}
          </HStack>
        </HStack>

        <Menu>
          <MenuButton as={Button} rightIcon={<HiChevronDown />}>
            {user.name}
          </MenuButton>
          <MenuList>
            <MenuItem>프로필</MenuItem>
            <MenuItem onClick={logout}>로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
} 