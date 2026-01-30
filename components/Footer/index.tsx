'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';

import { OffsetTransition } from '@/components/Motion';
import Settings from '@/components/Settings';
import { Button, Icon } from '@/components/UI';

const emptySubscribe = () => () => {};

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} target='_blank' rel='noreferrer'>
    <Button variant='ghostLink' className='h-auto px-0 py-0 text-xs md:text-sm'>
      {children}
    </Button>
  </Link>
);

const FooterContent = () => (
  <div className='flex justify-center items-center gap-2'>
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
    <footer className='mt-20 border-t border-border bg-card py-4 text-center'>
      {/* Settings Button */}
      <div className='fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-[9997] text-muted-foreground dark:text-muted-foreground'>
        <Settings />
      </div>
      {/* Scroll To Top Button */}
      <div className='fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-[9997] text-muted-foreground dark:text-muted-foreground'>
        <OffsetTransition componentRef={backToTopRef}>
          <Button
            variant='default'
            ref={backToTopRef}
            aria-label='scroll to top'
            onClick={handleScrollToTop}
            className='bg-card w-10 h-10 p-0 transition-colors group/btn'
          >
            <Icon
              name='caretUp'
              size={20}
              className='text-gruv-orange group-hover/btn:text-gruv-aqua transition-colors'
            />
          </Button>
        </OffsetTransition>
      </div>
      <FooterContent />
    </footer>
  );
}
