import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
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

    const defaultClassName =
      'w-full border-collapse bg-white dark:bg-neutral-800';

    return (
      <div
        className='overflow-x-auto border border-neutral-200 dark:border-neutral-700 mt-4'
        style={{ borderRadius: `${radius}px` }}
      >
        <table
          ref={ref}
          className={twMerge(defaultClassName, className)}
          {...props}
        />
      </div>
    );
  },
);

Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    const defaultClassName = 'bg-white dark:bg-neutral-900';

    return (
      <thead
        ref={ref}
        className={twMerge(defaultClassName, className)}
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
    const defaultClassName =
      'border-b border-neutral-200 dark:border-neutral-800 last:border-b-0';

    return (
      <tr
        ref={ref}
        className={twMerge(defaultClassName, className)}
        {...props}
      />
    );
  },
);

TableRow.displayName = 'TableRow';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, isHeader = false, ...props }, ref) => {
    const defaultClassName = isHeader
      ? 'py-4 px-6 font-medium text-left border-b border-r border-neutral-200 dark:border-neutral-700 last:border-r-0'
      : 'py-4 px-6 border-b border-r border-neutral-200 dark:border-neutral-700 last:border-r-0 [tr:last-child_&]:border-b-0';

    const Tag = isHeader ? 'th' : 'td';

    return (
      <Tag
        ref={ref}
        className={twMerge(defaultClassName, className)}
        {...props}
      />
    );
  },
);

TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableCell };
