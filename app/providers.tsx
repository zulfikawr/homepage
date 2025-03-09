'use client';

import { AuthProvider } from '@/contexts/authContext';
import { ThemeProvider } from 'next-themes';
import { TitleProvider } from '@/contexts/titleContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
      >
        <TitleProvider>{children}</TitleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
