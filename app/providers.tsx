'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
      // 모바일 터치 영역 최적화
      'input, select, textarea, button': {
        fontSize: '16px', // 모바일에서 자동 확대 방지
        minHeight: '44px', // 터치 영역 최소 크기
      },
      // 모바일에서 폼 요소 간격 조정
      'form label': {
        fontSize: '1rem',
        fontWeight: 'medium',
        marginBottom: '4px',
      },
    },
  },
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0080ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </>
  );
} 