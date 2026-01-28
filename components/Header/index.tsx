'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

import { drawer } from '@/components/Drawer';
import { Kbar } from '@/components/Kbar';
import { KbarContent } from '@/components/Kbar/components';
import {
  CyclingHideTransition,
  CyclingShowTransition,
  HeaderTransition,
} from '@/components/Motion';
import ScrollWrapper from '@/components/Motion/scroll';
import { Button } from '@/components/UI/Button';
import { useTitle } from '@/contexts/titleContext';
import { useRouteInfo } from '@/hooks';

import ImageWithFallback from '../ImageWithFallback';

interface HeaderComponentProps {
  headerRef: React.RefObject<HTMLDivElement>;
}

const HeaderComponent = ({ headerRef }: HeaderComponentProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLDivElement>(null);

  const { nonHomePage, isHomePage, isPagesPage } = useRouteInfo();

  const scrollHandler = (position: number) => {
    if (!headerRef?.current) return;
    headerRef.current.style.transform = `translateY(${15 - position || 0}%)`;
  };

  return (
    <ScrollWrapper handler={scrollHandler} startPosition={0} endPosition={15}>
      <header
        ref={headerRef}
        id='header'
        className='header fixed top-0 z-50 w-full pl-2 py-2 lg:px-4 lg:py-4 duration-300'
      >
        <div className='relative mx-auto flex w-full max-w-screen-lg items-center px-4 lg:px-0'>
          {/* Desktop Logo */}
          <Link
            href='/'
            prefetch={true}
            className='relative z-10 select-none hidden lg:block'
          >
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
                  sizes='24px'
                />
              </div>
              <div className='text-base font-medium text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground'>
                Zulfikar
              </div>
            </div>
          </Link>

          {/* Mobile Logo/Title - cycles with logo */}
          <div className='lg:hidden relative z-10 flex-shrink-0'>
            <CyclingHideTransition>
              <Link href='/' prefetch={true} className='select-none'>
                <div className='group flex items-center space-x-3 flex-shrink-0'>
                  <div className='flex size-[24px] flex-shrink-0 items-center rounded-full'>
                    <ImageWithFallback
                      className='rounded-full'
                      src='/favicon/android-chrome-192x192.png'
                      alt='Zulfikar'
                      height={24}
                      width={24}
                      loading='lazy'
                      type='square'
                      sizes='24px'
                    />
                  </div>
                  <div className='text-base font-medium text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground'>
                    Zulfikar
                  </div>
                </div>
              </Link>
            </CyclingHideTransition>

            {(nonHomePage || isHomePage) && (
              <div className='absolute left-0 top-0 h-full flex items-center'>
                <CyclingShowTransition
                  disabled={!(nonHomePage || isHomePage)}
                  componentRef={mobileTitleRef}
                >
                  <div ref={mobileTitleRef} className='pointer-events-auto'>
                    <MobileHeaderTitle />
                  </div>
                </CyclingShowTransition>
              </div>
            )}
          </div>

          <div className='absolute inset-x-0 mx-auto w-full flex justify-center pointer-events-none'>
            <div className='pointer-events-auto flex justify-center w-full'>
              {/* Desktop: Show Kbar at top, Title when scrolled */}
              <div className='hidden lg:block relative w-full'>
                {nonHomePage ? (
                  <>
                    <CyclingHideTransition>
                      <Kbar />
                    </CyclingHideTransition>
                    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                      <CyclingShowTransition
                        disabled={!nonHomePage}
                        componentRef={titleRef}
                      >
                        <div ref={titleRef} className='pointer-events-auto'>
                          <HeaderTitle />
                        </div>
                      </CyclingShowTransition>
                    </div>
                  </>
                ) : (
                  <div className='w-full flex justify-center'>
                    <Kbar />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='ml-auto flex items-center space-x-2'>
            {!isPagesPage ? (
              <Button
                type='ghost'
                icon='folder'
                className='hidden lg:flex items-center space-x-2'
              >
                <Link href='/pages' prefetch={true}>
                  Pages
                </Link>
              </Button>
            ) : (
              <Button
                type='ghost'
                icon='folder'
                className='hidden lg:flex items-center space-x-2'
              >
                <Link href='/home' prefetch={true}>
                  Home
                </Link>
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !headerTitle) return null;

  return (
    <h3 className='w-full max-w-full text-center overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm md:text-base'>
      {headerTitle}
    </h3>
  );
};

const MobileHeaderTitle = () => {
  const { headerTitle } = useTitle();
  const { isHomePage } = useRouteInfo();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Show "Home" on home page, otherwise show headerTitle
  const displayTitle = isHomePage ? 'Home' : headerTitle;

  if (!displayTitle) return null;

  return (
    <div className='text-base font-medium text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap'>
      {displayTitle}
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
