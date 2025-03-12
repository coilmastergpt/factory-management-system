'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Providers } from './providers';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import React from 'react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
} 