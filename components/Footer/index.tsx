'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { OffsetTransition } from '@/components/Motion';
import { Button } from '@/components/UI';
import Settings from '@/components/Settings';

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
  const [mounted, setMounted] = useState(false);
  const backToTopRef = useRef<HTMLButtonElement>(null);

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
      {/* Settings Button */}
      <div className='fixed bottom-8 left-8 z-[9997] text-neutral-500 dark:text-neutral-300'>
        <Settings />
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
