'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

import { ThemeSync } from '@/components/visual/theme-sync';
import { AuthProvider } from '@/contexts/auth-context';
import { BackgroundProvider } from '@/contexts/background-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { RadiusProvider } from '@/contexts/radius-context';
import { TitleProvider } from '@/contexts/title-context';
import { WeatherProvider } from '@/contexts/weather-context';

export default function Providers({
  children,
  defaultTheme = 'system',
  defaultBackground = 'none',
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultBackground?: string;
}) {
  useEffect(() => {
    // Clear the background style set by the anti-flash script
    // to allow CSS/next-themes to take over.
    document.documentElement.style.background = '';
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme={defaultTheme}
        enableSystem={true}
        themes={[
          'light',
          'dark',
          'gruvbox-light',
          'gruvbox-dark',
          'monokai',
          'dracula',
          'nord',
          'catppuccin',
          'tokyo-night',
          'solarized',
          'everforest',
          'rose-pine',
          'one-dark',
          'kanagawa',
          'nightfly',
        ]}
      >
        <ThemeSync />
        <BackgroundProvider initialBackground={defaultBackground}>
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
