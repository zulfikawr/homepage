'use client';

import { AuthProvider } from '@/contexts/authContext';
import { ThemeProvider } from 'next-themes';
import { TitleProvider } from '@/contexts/titleContext';
import { EffectProvider } from '@/contexts/effectContext';
import { BackgroundProvider } from '@/contexts/backgroundContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
      >
        <BackgroundProvider>
          <TitleProvider>
            <EffectProvider>{children}</EffectProvider>
          </TitleProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
