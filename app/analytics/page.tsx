'use client';

import { useFetchData } from '@/lib/fetchData';
import { getAllPageViews } from '@/functions/analytics';
import PageTitle from '@/components/PageTitle';

export default function AnalyticsPage() {
  const { data: pageViews, loading, error } = useFetchData(getAllPageViews);

  return (
    <div className='p-6'>
      <PageTitle
        emoji='📊'
        title='Page Views Analytics'
        subtitle='Overview of all page views across the site'
        route='/analytics'
      />

      {loading ? (
        <p className='mt-4 text-center text-lg dark:text-white'>Loading...</p>
      ) : error ? (
        <p className='mt-4 text-center text-lg text-red-500'>{error}</p>
      ) : (
        <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-4'>
          <table className='w-full border-collapse bg-white dark:bg-gray-800'>
            <thead>
              <tr className='bg-white dark:bg-gray-900'>
                <th className='py-4 px-6 font-medium text-left border-b border-gray-200 dark:border-gray-700'>
                  Route
                </th>
                <th className='py-4 px-6 font-medium text-left border-b border-gray-200 dark:border-gray-700'>
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {pageViews &&
                Object.entries(pageViews).map(
                  ([route, views], index, array) => (
                    <tr
                      key={route}
                      className={`border-b border-gray-200 dark:border-gray-800 ${
                        index === array.length - 1 ? 'last:border-b-0' : ''
                      }`}
                    >
                      <td className='py-4 px-6 bg-gray-50 dark:bg-gray-700 font-medium border-r border-gray-200 dark:border-gray-700 w-1/3'>
                        {route}
                      </td>
                      <td className='py-4 px-6 border-b border-gray-200 dark:border-gray-700'>
                        {views}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
