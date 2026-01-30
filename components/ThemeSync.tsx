'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [theme]);

  return null;
}
