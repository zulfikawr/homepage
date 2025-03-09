'use client';

import { OffsetTransition } from '@/components/Motion';
import { Button } from '@/components/UI';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';

const themes = ['system', 'dark', 'light'] as const;
const targetThemes = ['dark', 'light', 'system'] as const;

const ThemeIcon = ({ theme }: { theme: (typeof themes)[number] }) => {
  switch (theme) {
    case 'system':
      return 'desktop';
    case 'dark':
      return 'moon';
    case 'light':
      return 'sun';
  }
};

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    target='_blank'
    rel='noreferrer'
    className='hover:underline'
  >
    {children}
  </Link>
);

const FooterContent = () => (
  <div className='text-4 tracking-wide text-gray-500 dark:text-gray-400'>
    <FooterLink href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>
      CC BY-NC-SA 4.0
    </FooterLink>
    <span> · </span>
    <FooterLink href='https://github.com/zulfikawr/homepage/'>
      Open Source Software (OSS)
    </FooterLink>
  </div>
);

export default function Footer() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = useCallback(() => {
    const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
    setTheme(targetThemes[currentIndex]);
  }, [theme, setTheme]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!mounted) {
    return (
      <footer className='mt-20 border-b border-t border-gray-200 bg-white py-4 text-center dark:border-gray-700 dark:bg-gray-800'>
        <FooterContent />
      </footer>
    );
  }

  return (
    <footer className='mt-20 border-b border-t border-gray-200 bg-white py-4 text-center dark:border-gray-700 dark:bg-gray-800'>
      <div className='fixed bottom-8 left-8 z-[9998] text-gray-500 dark:text-gray-300'>
        <Button
          type='default'
          aria-label={`Change theme (current: ${theme})`}
          onClick={handleThemeChange}
          className='bg-white dark:bg-gray-800 dark:hover:bg-gray-700 w-10 h-10'
          icon={ThemeIcon({ theme: theme as (typeof themes)[number] })}
        />
      </div>

      <div className='fixed bottom-8 right-8 z-[9998] text-gray-500 dark:text-gray-300'>
        <OffsetTransition componentRef={backToTopRef}>
          <Button
            type='default'
            ref={backToTopRef}
            icon='caretUp'
            aria-label='scroll to top'
            onClick={handleScrollToTop}
            className='bg-white dark:bg-gray-800 dark:hover:bg-gray-700 w-10 h-10'
          />
        </OffsetTransition>
      </div>

      <FooterContent />
    </footer>
  );
}
