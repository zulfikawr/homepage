'use client';

import { usePathname } from 'next/navigation';

export function useRouteInfo() {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const nonHomePage = pathname.split('/').length > 2;
  const isPagesPage = pathname === '/pages/';

  return {
    pathname,
    isHomePage,
    nonHomePage,
    isPagesPage,
  };
}
