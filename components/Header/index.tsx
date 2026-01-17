'use client';

import { type MutableRefObject, useRef } from 'react';
import Link from 'next/link';
import { drawer } from '@/components/Drawer';
import { HeaderTransition, OffsetTransition } from '@/components/Motion';
import ScrollWrapper from '@/components/Motion/scroll';
import { useTitle } from '@/contexts/titleContext';
import { Kbar } from '@/components/Kbar';
import { KbarContent } from '@/components/Kbar/components';
import { useRouteInfo } from '@/hooks/useRouteInfo';
import { Button } from '@/components/UI/Button';
import ImageWithFallback from '../ImageWithFallback';

interface HeaderComponentProps {
  headerRef: MutableRefObject<HTMLDivElement>;
}

const HeaderComponent = ({ headerRef }: HeaderComponentProps) => {
  const titleRef = useRef<HTMLDivElement>(null);

  const { isHomePage, nonHomePage } = useRouteInfo();

  const scrollHandler = (position: number) => {
    if (!headerRef?.current) return;
    headerRef.current.style.transform = `translateY(${15 - position || 0}%)`;
  };

  return (
    <ScrollWrapper handler={scrollHandler} startPosition={0} endPosition={15}>
      <header
        ref={headerRef}
        id='header'
        className='header fixed top-0 z-50 w-full px-3 py-2 lg:px-5 lg:py-4 duration-300'
      >
        <div className='relative mx-auto flex w-full max-w-screen-lg items-center px-4 lg:px-0'>
          <Link href='/' passHref className='relative z-10'>
            <div className='group flex items-center space-x-3 flex-shrink-0 z-10'>
              <div className='flex size-[24px] flex-shrink-0 items-center rounded-full'>
                <ImageWithFallback
                  className='rounded-full'
                  src='/favicon/android-chrome-192x192.png'
                  alt='Zulfikar'
                  height={24}
                  width={24}
                  loading='lazy'
                  type='square'
                />
              </div>
              <div className='text-base font-medium text-muted-foreground group-hover:text-neutral-800 dark:group-hover:text-neutral-200'>
                Zulfikar
              </div>
            </div>
          </Link>

          <OffsetTransition disabled={!nonHomePage} componentRef={titleRef}>
            <div
              ref={titleRef}
              className='absolute inset-x-0 mx-auto w-full flex justify-center pointer-events-none'
            >
              <div className='pointer-events-auto'>
                {!isHomePage ? <HeaderTitle /> : <Kbar />}
              </div>
            </div>
          </OffsetTransition>

          <div className='ml-auto flex items-center space-x-2'>
            {isHomePage ? (
              <Button
                type='ghost'
                icon='folder'
                className='hidden lg:flex items-center space-x-2'
              >
                <Link href='/pages'>Pages</Link>
              </Button>
            ) : (
              <Button
                type='ghost'
                icon='magnifyingGlass'
                className='hidden lg:flex items-center space-x-2'
                onClick={() => drawer.open(<KbarContent />)}
              >
                Search
              </Button>
            )}
            <Button
              type='ghost'
              icon='list'
              className='flex lg:hidden'
              onClick={() => drawer.open(<KbarContent />)}
            />
          </div>
        </div>
      </header>
    </ScrollWrapper>
  );
};

const HeaderTitle = () => {
  const { headerTitle } = useTitle();

  if (!headerTitle) return null;

  return (
    <h3 className='w-full max-w-[calc(90vw-180px)] text-center overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm md:text-base'>
      {headerTitle}
    </h3>
  );
};

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <HeaderTransition componentRef={headerRef}>
      <HeaderComponent headerRef={headerRef} />
    </HeaderTransition>
  );
};

export default Header;
