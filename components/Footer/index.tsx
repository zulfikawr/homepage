'use client';

import { useRouter } from 'next/navigation';
import { OffsetTransition } from '@/components/Motion';
import { Button, Dropdown, Switch, ToggleGroup } from '@/components/UI';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useEffectToggle } from '@/contexts/effectContext';
import { useRouteInfo } from '@/hooks/useRouteInfo';
import { useBackground } from '@/contexts/backgroundContext';

const themeOptions = [
  { label: 'System', value: 'system', icon: 'desktop' },
  { label: 'Light', value: 'light', icon: 'sun' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
];

const backgroundOptions = [
  { label: 'Clouds', value: 'clouds', icon: 'cloudMoon' },
  { label: 'Waves', value: 'waves', icon: 'waves' },
  { label: 'Tetris', value: 'tetris', icon: 'wall' },
];

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
  <div className='text-4 tracking-wide text-neutral-500 dark:text-neutral-400'>
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
  const { background, setBackground } = useBackground();
  const [mounted, setMounted] = useState(false);
  const { effectEnabled, toggleEffect } = useEffectToggle();
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const { isHomePage } = useRouteInfo();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!mounted) {
    return (
      <footer className='mt-20 border-b border-t border-neutral-200 bg-white py-4 text-center dark:border-neutral-700 dark:bg-neutral-800'>
        <FooterContent />
      </footer>
    );
  }

  return (
    <footer className='mt-20 border-b border-t border-neutral-200 bg-white py-4 text-center dark:border-neutral-700 dark:bg-neutral-800'>
      {/* Settings Dropdown */}
      <div className='fixed bottom-8 left-8 z-[9997] text-neutral-500 dark:text-neutral-300'>
        <Dropdown
          trigger={
            <Button
              type='default'
              aria-label='Open settings'
              icon='gear'
              className='bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700 w-10 h-10'
            />
          }
        >
          <div className='p-3 space-y-2'>
            {!isHomePage && (
              <>
                <div className='text-left text-md text-neutral-600 dark:text-neutral-400'>
                  Navigation
                </div>
                <Button
                  type='ghost'
                  className='w-full justify-start px-2 py-0 h-8'
                  icon='arrowLeft'
                  onClick={() => router.back()}
                >
                  Back
                </Button>
                <Button
                  type='ghost'
                  className='w-full justify-start px-2 py-0 h-8'
                  icon='houseLine'
                  onClick={() => router.push('/')}
                >
                  Home
                </Button>
              </>
            )}

            <div className='text-left text-md text-neutral-600 dark:text-neutral-400'>
              Background
            </div>
            <ToggleGroup
              value={background}
              onChange={setBackground}
              options={backgroundOptions}
            />

            <div className='text-left text-md text-neutral-600 dark:text-neutral-400'>
              Effects
            </div>
            <Switch
              id='effect-switch'
              checked={effectEnabled}
              onChange={toggleEffect}
              label={effectEnabled ? 'Disable Effects' : 'Enable Effects'}
            />

            <div className='text-left text-md text-neutral-600 dark:text-neutral-400'>
              Theme
            </div>
            <ToggleGroup
              value={theme}
              onChange={setTheme}
              options={themeOptions}
            />
          </div>
        </Dropdown>
      </div>

      {/* Scroll To Top Button */}
      <div className='fixed bottom-8 right-8 z-[9997] text-neutral-500 dark:text-neutral-300'>
        <OffsetTransition componentRef={backToTopRef}>
          <Button
            type='default'
            ref={backToTopRef}
            icon='caretUp'
            aria-label='scroll to top'
            onClick={handleScrollToTop}
            className='bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700 w-10 h-10'
          />
        </OffsetTransition>
      </div>

      <FooterContent />
    </footer>
  );
}
