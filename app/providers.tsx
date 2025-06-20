'use client';

import { AuthProvider } from '@/contexts/authContext';
import { ThemeProvider } from 'next-themes';
import { TitleProvider } from '@/contexts/titleContext';
import { EffectProvider } from '@/contexts/effectContext';
import { BackgroundProvider } from '@/contexts/backgroundContext';
import { RadiusProvider } from '@/contexts/radiusContext';

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
            <EffectProvider>
              <RadiusProvider>{children}</RadiusProvider>
            </EffectProvider>
          </TitleProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
