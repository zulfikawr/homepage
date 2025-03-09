'use client';

import { type MutableRefObject, useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { drawer } from '@/components/Drawer';
import { HeaderTransition, OffsetTransition } from '../Motion';
import ScrollWrapper from '../Motion/scroll';
import Tabs from '../Tabs';
import { useTitle } from 'contexts/titleContext';
import { Kbar } from '../Kbar';
import { KbarContent } from '../Kbar/components';
import { useRouteInfo } from '@/hooks/useRouteInfo';

interface HeaderComponentProps {
  headerRef: MutableRefObject<HTMLDivElement>;
}

const HeaderComponent = ({ headerRef }: HeaderComponentProps) => {
  const { resolvedTheme } = useTheme();
  const titleRef = useRef<HTMLDivElement>(null);

  const { isPagesPage, nonHomePage } = useRouteInfo();

  const leftTabItems = [
    {
      key: 'avatar',
      label: 'Avatar',
      hoverable: false,
      component: (
        <div className='group mx-auto flex h-full cursor-pointer items-center justify-center space-x-3 px-5'>
          <div className='flex h-[18px] w-[18px] flex-shrink-0 items-center rounded-full border border-gray-300 dark:border-gray-500'>
            <Image
              className='rounded-full'
              src={resolvedTheme === 'dark' ? '/icon-dark.png' : '/icon.png'}
              alt='Zulfikar'
              height={18}
              width={18}
              loading='lazy'
            />
          </div>
          <div className='text-3 font-medium text-black'>
            <Link href='/' passHref>
              <h3 className='text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'>
                Zulfikar
              </h3>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const rightTabItems = [
    {
      key: 'home',
      label: 'Home',
      icon: 'houseLine',
      link: {
        internal: '/',
      },
      className: nonHomePage ? 'block' : 'hidden',
    },
    {
      key: 'pages',
      label: 'Pages',
      icon: 'folder',
      link: {
        internal: '/pages',
      },
      className: isPagesPage ? 'hidden' : 'sm:block',
    },
    {
      key: 'searchdesktop',
      label: 'Search',
      icon: 'magnifyingGlass',
      className: nonHomePage ? 'lg:block' : 'hidden',
      onClick: () => {
        drawer.open(<KbarContent />);
      },
    },
    {
      key: 'searchmobile',
      label: 'Search',
      icon: 'magnifyingGlass',
      className: 'block lg:hidden', // Always show on mobile
      onClick: () => {
        drawer.open(<KbarContent />);
      },
    },
  ];

  const scrollHandler = (position: number) => {
    if (!headerRef?.current) return;
    headerRef.current.style.transform = `translateY(${15 - position || 0}%)`;
  };

  return (
    <ScrollWrapper handler={scrollHandler} startPosition={0} endPosition={15}>
      <header
        ref={headerRef}
        id='header'
        className='header fixed top-0 z-50 grid h-auto w-full grid-cols-8 px-1 py-2 leading-14 duration-300 lg:px-5 lg:py-4'
      >
        <div className='col-start-1 col-end-3 flex h-full items-center'>
          <Tabs items={leftTabItems} />
        </div>
        <OffsetTransition disabled={!nonHomePage} componentRef={titleRef}>
          <div
            ref={titleRef}
            className='col-start-3 col-end-7 flex items-center justify-center mx-3'
          >
            {nonHomePage ? <HeaderTitle /> : <Kbar />}
          </div>
        </OffsetTransition>
        <div className='col-start-7 col-end-9 flex h-full items-center justify-end space-x-2 mr-2'>
          <Tabs items={rightTabItems} />
        </div>
      </header>
    </ScrollWrapper>
  );
};

const HeaderTitle = () => {
  const { headerTitle } = useTitle();

  if (!headerTitle) return null;

  return (
    <div className='mx-auto hidden items-center justify-center space-x-3 overflow-hidden lg:flex'>
      <h3 className='overflow-hidden text-ellipsis whitespace-nowrap font-medium'>
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
