'use client';

import { ThemeProvider } from 'next-themes';

import { AuthProvider } from '@/contexts/authContext';
import { BackgroundProvider } from '@/contexts/backgroundContext';
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
              <WeatherProvider>
                <RadiusProvider>{children}</RadiusProvider>
              </WeatherProvider>
            </TitleProvider>
          </LoadingProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
