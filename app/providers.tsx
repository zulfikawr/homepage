'use client';

import { ThemeProvider } from 'next-themes';

import { AuthProvider } from '@/contexts/authContext';
import { BackgroundProvider } from '@/contexts/backgroundContext';
import { EffectProvider } from '@/contexts/effectContext';
import { LoadingProvider } from '@/contexts/loadingContext';
import { RadiusProvider } from '@/contexts/radiusContext';
import { TitleProvider } from '@/contexts/titleContext';
import { WeatherProvider } from '@/contexts/weatherContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
      >
        <BackgroundProvider>
          <LoadingProvider>
            <TitleProvider>
              <EffectProvider>
                <WeatherProvider>
                  <RadiusProvider>{children}</RadiusProvider>
                </WeatherProvider>
              </EffectProvider>
            </TitleProvider>
          </LoadingProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
