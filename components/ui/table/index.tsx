'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';
import { Shimmer } from '@/components/ui/shimmer';

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
        className='overflow-x-auto mt-4 border-2 border-border shadow-brutalist transition-all duration-150 hover:shadow-brutalist-xl bg-card'
        style={{ borderRadius: `${radius}px` }}
      >
        <table
          ref={ref}
          className={twMerge('w-full border-collapse', className)}
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
          'border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors bg-card',
          className,
        )}
        {...props}
      />
    );
  },
);

TableRow.displayName = 'TableRow';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, isHeader = false, children, ...props }, ref) => {
    const Tag = isHeader ? 'th' : 'td';
    // Keep plain text inside an element: shimmer-from-structure measures leaf
    // text nodes by temporarily wrapping/unwrapping them, which would retrigger
    // the table's ResizeObserver in a loop.
    const content =
      typeof children === 'string' || typeof children === 'number' ? (
        <span>{children}</span>
      ) : (
        children
      );

    return (
      <Tag
        ref={ref}
        className={twMerge(
          isHeader
            ? 'py-4 px-6 font-medium text-left border-b-2 border-border'
            : 'py-4 px-6',
          className,
        )}
        {...props}
      >
        {content}
      </Tag>
    );
  },
);

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 8,
  cols = 4,
}) => {
  return (
    <Shimmer loading>
      <Table className='mt-0'>
        <TableHeader>
          <TableRow>
            {Array.from({ length: cols }).map((_, index) => (
              <TableCell key={index} isHeader>
                Column
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <TableCell key={colIndex}>Value</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Shimmer>
  );
};

export { Table, TableBody, TableCell, TableHeader, TableRow, TableSkeleton };
