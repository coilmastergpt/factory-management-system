'use client';

import { extendTheme } from '@chakra-ui/react';
import { Providers } from './providers';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import React from 'react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        WebkitTapHighlightColor: 'transparent',
      },
      'input, select, textarea': {
        fontSize: '16px !important',
        minHeight: '44px',
        padding: '10px 14px',
      },
      'form label': {
        fontSize: '1rem',
        fontWeight: 'medium',
        marginBottom: '8px',
        display: 'block',
      },
      'select': {
        appearance: 'none',
        paddingRight: '2rem',
        background: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E") right 0.5rem center/1.5em 1.5em no-repeat',
      },
    },
  },
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
        minHeight: '44px',
        padding: '10px 16px',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'black',
          fontWeight: 'bold',
          borderWidth: '2px',
          borderColor: 'brand.300',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
          _hover: {
            bg: 'brand.600',
            borderColor: 'brand.400',
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
        },
        ghost: {
          color: 'black',
          bg: 'transparent',
          border: '1px solid',
          borderColor: 'brand.200',
          fontWeight: 'bold',
          _hover: {
            bg: 'brand.50',
            borderColor: 'brand.300',
            color: 'black',
          },
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 3,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 4,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 5,
          minHeight: '56px',
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        textTransform: 'capitalize',
        fontWeight: 'medium',
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
    <html lang="th">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers>
          <AuthProvider>
            <LanguageProvider>
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </LanguageProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
} 