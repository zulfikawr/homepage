'use client';

import { getAllPageViews } from '@/functions/analytics';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { useRealtimeData } from '@/hooks';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/UI';

const SkeletonLoader = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Route</TableCell>
          <TableCell isHeader>Views</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className='bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-300 dark:border-neutral-600 w-2/3'>
              <div className='animate-pulse'>
                <div className='h-6 w-24 bg-neutral-100 dark:bg-neutral-900' />
              </div>
            </TableCell>
            <TableCell>
              <div className='animate-pulse'>
                <div className='h-6 w-24 bg-neutral-200 dark:bg-neutral-700' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function AnalyticsContent() {
  const { data: pageViews, loading, error } = useRealtimeData(getAllPageViews);

  type PageViews = {
    [key: string]: number | PageViews;
  };

  function flattenPageViews(
    obj: PageViews,
    prefix = '',
  ): Record<string, number> {
    const result: Record<string, number> = {};

    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}/${key}` : key;

      if (typeof value === 'number') {
        result[newKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(result, flattenPageViews(value, newKey));
      }
    }

    return result;
  }

  const flattenedPageViews = pageViews ? flattenPageViews(pageViews) : {};

  const sortedPageViews = Object.entries(flattenedPageViews).sort(
    ([, viewsA], [, viewsB]) => viewsB - viewsA,
  );

  const formatRoute = (route: string) => {
    if (route === 'root') return '/';
    if (route.startsWith('database') || route.startsWith('login')) return null;
    return `/${route}`;
  };

  return (
    <div>
      <PageTitle
        emoji='📊'
        title='Analytics'
        subtitle='Overview of all page views across the site'
        route='/analytics'
      />

      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <p className='text-center text-lg text-red-500'>{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Route</TableCell>
              <TableCell isHeader>Views</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPageViews.map(([route, views]) => {
              const formattedRoute = formatRoute(route);
              if (!formattedRoute) return null;

              return (
                <TableRow key={route}>
                  <TableCell className='bg-neutral-50 dark:bg-neutral-700 font-medium border-b border-neutral-300 dark:border-neutral-600 w-2/3'>
                    <Link
                      href={formattedRoute}
                      className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      {formattedRoute}
                    </Link>
                  </TableCell>
                  <TableCell>{views}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
