'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

import { ThemeSync } from '@/components/Visual/ThemeSync';
import { AuthProvider } from '@/contexts/authContext';
import { BackgroundProvider } from '@/contexts/backgroundContext';
import { LoadingProvider } from '@/contexts/loadingContext';
import { RadiusProvider } from '@/contexts/radiusContext';
import { TitleProvider } from '@/contexts/titleContext';
import { WeatherProvider } from '@/contexts/weatherContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear the background style set by the anti-flash script
    // to allow CSS/next-themes to take over.
    document.documentElement.style.background = '';
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
      >
        <ThemeSync />
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
