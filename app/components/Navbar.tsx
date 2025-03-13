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
  Image,
  Container,
  Divider,
  Avatar,
  Icon,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import { HiHome, HiClipboardList, HiUserGroup, HiChevronDown, HiCog, HiLogout, HiUser, HiTranslate, HiMenu } from 'react-icons/hi';
import NextLink from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactElement;
  isActive?: boolean;
}

const NavLink = ({ href, children, icon, isActive }: NavLinkProps) => (
  <Link
    as={NextLink}
    href={href}
    px={4}
    py={2}
    rounded="md"
    bg={isActive ? 'brand.50' : 'transparent'}
    color={isActive ? 'brand.600' : 'gray.700'}
    fontWeight={isActive ? 'medium' : 'normal'}
    _hover={{
      textDecoration: 'none',
      bg: isActive ? 'brand.50' : 'gray.100',
    }}
    display="flex"
    alignItems="center"
    gap={2}
    transition="all 0.2s"
  >
    {icon}
    {children}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const bgColor = useColorModeValue('white', 'gray.900');
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'ko' : 'th');
  };

  return (
    <Box bg={bgColor} px={4} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Flex alignItems="center">
              <Text fontSize="xl" fontWeight="bold" color="brand.600">
                CoilMaster
              </Text>
              <Text fontSize="sm" color="gray.500" ml={2} display={{ base: "none", md: "block" }}>
                {t('nav.system')}
              </Text>
            </Flex>
            <HStack as="nav" spacing={1} display={{ base: "none", md: "flex" }}>
              <NavLink 
                href="/dashboard" 
                icon={<Icon as={HiHome} />}
                isActive={pathname === '/dashboard'}
              >
                {t('nav.dashboard')}
              </NavLink>
              <NavLink 
                href="/issues" 
                icon={<Icon as={HiClipboardList} />}
                isActive={pathname === '/issues' || pathname?.startsWith('/issues/')}
              >
                {t('nav.issues')}
              </NavLink>
              <NavLink 
                href="/settings" 
                icon={<Icon as={HiCog} />}
                isActive={pathname === '/settings'}
              >
                {t('nav.settings')}
              </NavLink>
              {user.role === 'ADMIN' && (
                <NavLink 
                  href="/users" 
                  icon={<Icon as={HiUserGroup} />}
                  isActive={pathname === '/users'}
                >
                  {t('nav.users')}
                </NavLink>
              )}
            </HStack>
          </HStack>

          <HStack>
            <Tooltip label={language === 'th' ? 'เปลี่ยนเป็นภาษาเกาหลี' : '태국어로 전환'}>
              <IconButton
                aria-label="Toggle language"
                icon={<Icon as={HiTranslate} />}
                variant="ghost"
                onClick={toggleLanguage}
                size="md"
                color="black"
                bg="yellow.100"
                borderWidth="2px"
                borderColor="yellow.400"
                _hover={{ bg: 'yellow.200', borderColor: 'yellow.500', color: 'black' }}
              />
            </Tooltip>
            
            <Menu>
              <Tooltip label={`${user.name} (${user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้จัดการ'})`}>
                <MenuButton 
                  as={Button} 
                  rightIcon={<HiChevronDown />}
                  variant="ghost"
                  borderWidth="2px"
                  borderColor="yellow.400"
                  color="black"
                  bg="yellow.100"
                  fontWeight="bold"
                  _hover={{ bg: 'yellow.200', borderColor: 'yellow.500', color: 'black' }}
                >
                  <Flex alignItems="center">
                    <Avatar size="xs" name={user.name} mr={2} bg="brand.500" />
                    <Text>{user.name}</Text>
                  </Flex>
                </MenuButton>
              </Tooltip>
              <MenuList>
                <MenuItem icon={<Icon as={HiUser} />}>{t('nav.profile')}</MenuItem>
                <Divider />
                <MenuItem 
                  icon={<Icon as={HiLogout} />} 
                  onClick={logout}
                  color="red.500"
                >
                  {t('nav.logout')}
                </MenuItem>
              </MenuList>
            </Menu>
            
            {/* 모바일 메뉴 버튼 */}
            <Box display={{ base: "block", md: "none" }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="메뉴"
                  icon={<Icon as={HiMenu} />}
                  variant="ghost"
                  color="black"
                  borderWidth="1px"
                  borderColor="brand.200"
                  size="lg"
                />
                <MenuList>
                  <MenuItem 
                    as={NextLink} 
                    href="/dashboard" 
                    icon={<Icon as={HiHome} />}
                  >
                    {t('nav.dashboard')}
                  </MenuItem>
                  <MenuItem 
                    as={NextLink} 
                    href="/issues" 
                    icon={<Icon as={HiClipboardList} />}
                  >
                    {t('nav.issues')}
                  </MenuItem>
                  <MenuItem 
                    as={NextLink} 
                    href="/settings" 
                    icon={<Icon as={HiCog} />}
                  >
                    {t('nav.settings')}
                  </MenuItem>
                  {user.role === 'ADMIN' && (
                    <MenuItem 
                      as={NextLink} 
                      href="/users" 
                      icon={<Icon as={HiUserGroup} />}
                    >
                      {t('nav.users')}
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem 
                    icon={<Icon as={HiLogout} />} 
                    onClick={logout}
                    color="red.500"
                  >
                    {t('nav.logout')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
} 