'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
  isHeader?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    const { radius } = useRadius();

    return (
      <div
        className='overflow-x-auto mt-4 border-2 border-border shadow-brutalist transition-all duration-150 hover:shadow-brutalist-xl'
        style={{ borderRadius: `${radius}px` }}
      >
        <table
          ref={ref}
          className={twMerge('w-full border-collapse bg-card', className)}
          {...props}
        />
      </div>
    );
  },
);

Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={twMerge('bg-muted/50 dark:bg-muted/20', className)}
        {...props}
      />
    );
  },
);

TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={twMerge(className)} {...props} />;
  },
);

TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={twMerge(
          'border-b border-border last:border-b-0 hover:bg-muted/50 hover:shadow-brutalist transition-shadow',
          className,
        )}
        {...props}
      />
    );
  },
);

TableRow.displayName = 'TableRow';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, isHeader = false, ...props }, ref) => {
    const Tag = isHeader ? 'th' : 'td';

    return (
      <Tag
        ref={ref}
        className={twMerge(
          isHeader
            ? 'py-4 px-6 font-medium text-left border-b border-r border-border last:border-r-0'
            : 'py-4 px-6 border-b border-r border-border last:border-r-0 [tr:last-child&]:border-b-0',
          className,
        )}
        {...props}
      />
    );
  },
);

import { Skeleton } from '../skeleton';

TableCell.displayName = 'TableCell';

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
      className='overflow-x-auto border-2 border-border mt-4 shadow-brutalist'
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

export { Table, TableBody, TableCell, TableHeader, TableRow, TableSkeleton };
