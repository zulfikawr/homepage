'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';
import { useRadius } from '@/contexts/radiusContext';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 8,
  cols = 4,
}) => {
  const { radius } = useRadius();

  return (
    <div
      className='overflow-x-auto border border-border mt-4'
      style={{ borderRadius: `${radius}px` }}
    >
      <table className='w-full border-collapse bg-card'>
        <thead className='bg-muted/50 dark:bg-muted/20'>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className='py-4 px-6 border-b border-r border-border last:border-r-0'
              >
                <Skeleton width='60%' height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className='border-b border-border last:border-b-0'
            >
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className='py-4 px-6 border-r border-border last:border-r-0'
                >
                  <Skeleton
                    width={colIndex === 0 ? '40%' : '80%'}
                    height={14}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { TableSkeleton };
