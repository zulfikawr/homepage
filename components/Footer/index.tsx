'use client';

import { useRef, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { OffsetTransition } from '@/components/Motion';
import { Button } from '@/components/UI';
import Settings from '@/components/Settings';

const emptySubscribe = () => () => {};

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
  <div className='text-sm tracking-wide text-muted-foreground'>
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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const backToTopRef = useRef<HTMLButtonElement>(null);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!mounted) {
    return (
      <footer className='mt-20 border-b border-t border-border bg-card py-4 text-center'>
        <FooterContent />
      </footer>
    );
  }

  return (
    <footer className='mt-20 border-b border-t border-border bg-white py-4 text-center dark:border-border dark:bg-card'>
      {/* Settings Button */}
      <div className='fixed bottom-8 left-8 z-[9997] text-muted-foreground dark:text-neutral-300'>
        <Settings />
      </div>
      {/* Scroll To Top Button */}
      <div className='fixed bottom-8 right-8 z-[9997] text-muted-foreground dark:text-neutral-300'>
        <OffsetTransition componentRef={backToTopRef}>
          <Button
            type='default'
            ref={backToTopRef}
            icon='caretUp'
            aria-label='scroll to top'
            onClick={handleScrollToTop}
            className='bg-card dark:hover:bg-neutral-700 w-10 h-10'
          />
        </OffsetTransition>
      </div>
      <FooterContent />
    </footer>
  );
}
