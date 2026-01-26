'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { drawer } from '@/components/Drawer';
import {
  HeaderTransition,
  OffsetTransition,
  ReverseOffsetTransition,
} from '@/components/Motion';
import ScrollWrapper from '@/components/Motion/scroll';
import { useTitle } from '@/contexts/titleContext';
import { Kbar } from '@/components/Kbar';
import { KbarContent } from '@/components/Kbar/components';
import { useRouteInfo } from '@/hooks';
import { Button } from '@/components/UI/Button';
import ImageWithFallback from '../ImageWithFallback';

interface HeaderComponentProps {
  headerRef: React.RefObject<HTMLDivElement>;
}

const HeaderComponent = ({ headerRef }: HeaderComponentProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { isHomePage, nonHomePage } = useRouteInfo();

  const scrollHandler = (position: number) => {
    if (!headerRef?.current) return;
    headerRef.current.style.transform = `translateY(${15 - position || 0}%)`;
    setIsScrolled(position > 0);
  };

  return (
    <ScrollWrapper handler={scrollHandler} startPosition={0} endPosition={15}>
      <header
        ref={headerRef}
        id='header'
        className='header fixed top-0 z-50 w-full pl-2 py-2 lg:px-4 lg:py-4 duration-300'
      >
        <div className='relative mx-auto flex w-full max-w-screen-lg items-center px-4 lg:px-0'>
          <Link href='/' passHref className='relative z-10 select-none'>
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
              <div className='text-base font-medium text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground'>
                Zulfikar
              </div>
            </div>
          </Link>

          <div className='absolute inset-x-0 mx-auto w-full flex justify-center pointer-events-none'>
            <div className='pointer-events-auto flex justify-center w-full'>
              {/* Desktop: Show Kbar at top, Title when scrolled */}
              <div className='hidden lg:block relative w-full'>
                <ReverseOffsetTransition>
                  <Kbar />
                </ReverseOffsetTransition>
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                  <OffsetTransition
                    disabled={!nonHomePage}
                    componentRef={titleRef}
                  >
                    <div ref={titleRef} className='pointer-events-auto'>
                      <HeaderTitle />
                    </div>
                  </OffsetTransition>
                </div>
              </div>
              {/* Mobile: Removed HeaderTitle */}
            </div>
          </div>

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
              className='flex lg:hidden -mr-4'
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
