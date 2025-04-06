'use client';

import { type MutableRefObject, useRef } from 'react';
import { useTheme } from 'next-themes';
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
  const { resolvedTheme } = useTheme();
  const titleRef = useRef<HTMLDivElement>(null);

  const { isPagesPage, nonHomePage } = useRouteInfo();

  const scrollHandler = (position: number) => {
    if (!headerRef?.current) return;
    headerRef.current.style.transform = `translateY(${15 - position || 0}%)`;
  };

  return (
    <ScrollWrapper handler={scrollHandler} startPosition={0} endPosition={15}>
      <header
        ref={headerRef}
        id='header'
        className='header fixed top-0 z-50 grid h-auto w-full grid-cols-8 px-1 py-2 duration-300 lg:px-5 lg:py-4'
      >
        {/* Left side - Avatar and Name */}
        <div className='col-start-1 col-end-3 flex h-full items-center'>
          <div className='group mx-auto flex h-full cursor-pointer items-center justify-center space-x-3 px-5'>
            <div className='flex h-[18px] w-[18px] flex-shrink-0 items-center rounded-full border border-neutral-300 dark:border-neutral-500'>
              <ImageWithFallback
                className='rounded-full'
                src={resolvedTheme === 'dark' ? '/icon-dark.png' : '/icon.png'}
                alt='Zulfikar'
                height={18}
                width={18}
                loading='lazy'
                type='square'
              />
            </div>
            <div className='text-3 font-medium text-neutral-700 dark:text-neutral-300 dark:group-hover:text-neutral-200'>
              <Link href='/' passHref>
                Zulfikar
              </Link>
            </div>
          </div>
        </div>

        {/* Center - Title or Kbar */}
        <OffsetTransition disabled={!nonHomePage} componentRef={titleRef}>
          <div
            ref={titleRef}
            className='col-start-3 col-end-7 flex items-center justify-center mx-3'
          >
            {nonHomePage ? <HeaderTitle /> : <Kbar />}
          </div>
        </OffsetTransition>

        {/* Right side - Navigation buttons */}
        <div className='col-start-7 col-end-9 flex h-full items-center justify-end space-x-2 mr-2'>
          {nonHomePage && (
            <Button
              type='ghost'
              icon='houseLine'
              className='hidden sm:flex sm:items-center sm:space-x-2'
            >
              <Link href='/'>Home</Link>
            </Button>
          )}

          {!isPagesPage && (
            <Button
              type='ghost'
              icon='folder'
              className='hidden sm:flex items-center space-x-2'
            >
              <Link href='/pages'>Pages</Link>
            </Button>
          )}

          {nonHomePage && (
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
            icon='menu'
            className='flex lg:hidden'
            onClick={() => drawer.open(<KbarContent />)}
          />
        </div>
      </header>
    </ScrollWrapper>
  );
};

const HeaderTitle = () => {
  const { headerTitle } = useTitle();

  if (!headerTitle) return null;

  return (
    <div className='mx-auto flex items-center justify-center space-x-3 overflow-hidden'>
      <h3 className='overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm md:text-3'>
        {headerTitle}
      </h3>
    </div>
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
