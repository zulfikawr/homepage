'use client';

import { getAllPageViews } from '@/functions/analytics';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { useRealtimeData } from '@/hooks';

const SkeletonLoader = () => {
  return (
    <div className='overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 mt-4'>
      <table className='w-full border-collapse bg-white dark:bg-neutral-800'>
        <thead>
          <tr className='bg-white dark:bg-neutral-900'>
            <th className='py-4 px-6 font-medium text-left border-b border-neutral-200 dark:border-neutral-700'>
              Route
            </th>
            <th className='py-4 px-6 font-medium text-left border-b border-neutral-200 dark:border-neutral-700'>
              Views
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              className='border-b border-neutral-200 dark:border-neutral-800'
            >
              <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700 w-1/3'>
                <div className='animate-pulse'>
                  <div className='h-6 w-24 rounded bg-neutral-100 dark:bg-neutral-900' />
                </div>
              </td>
              <td className='py-4 px-6 border-b border-neutral-200 dark:border-neutral-700'>
                <div className='animate-pulse'>
                  <div className='h-6 w-24 rounded bg-neutral-200 dark:bg-neutral-700' />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function AnalyticsContent() {
  const { data: pageViews, loading, error } = useRealtimeData(getAllPageViews);

  const sortedPageViews = pageViews
    ? Object.entries(pageViews).sort(
        ([, viewsA], [, viewsB]) => viewsB - viewsA,
      )
    : [];

  const formatRoute = (route: string) => {
    if (route === 'root') return '/';
    return `/${route}`;
  };

  return (
    <div className='p-6'>
      <PageTitle
        emoji='📊'
        title='Page Views Analytics'
        subtitle='Overview of all page views across the site'
        route='/analytics'
      />

      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <p className='mt-4 text-center text-lg text-red-500'>{error}</p>
      ) : (
        <div className='overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 mt-4'>
          <table className='w-full border-collapse bg-white dark:bg-neutral-800'>
            <thead>
              <tr className='bg-white dark:bg-neutral-900'>
                <th className='py-4 px-6 font-medium text-left border-b border-neutral-200 dark:border-neutral-700'>
                  Route
                </th>
                <th className='py-4 px-6 font-medium text-left border-b border-neutral-200 dark:border-neutral-700'>
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPageViews.map(([route, views], index, array) => (
                <tr
                  key={route}
                  className={`border-b border-neutral-200 dark:border-neutral-800 ${
                    index === array.length - 1 ? 'last:border-b-0' : ''
                  }`}
                >
                  <td className='py-4 px-6 bg-neutral-50 dark:bg-neutral-700 font-medium border-r border-neutral-200 dark:border-neutral-700 w-1/3'>
                    <Link
                      href={formatRoute(route)}
                      className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      {formatRoute(route)}
                    </Link>
                  </td>
                  <td
                    className={`py-4 px-6 border-b border-neutral-200 dark:border-neutral-700 ${
                      index === array.length - 1 ? 'last:border-b-0' : ''
                    }`}
                  >
                    {views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
