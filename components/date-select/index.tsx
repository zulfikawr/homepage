'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button, Dropdown, DropdownItem } from '@/components/ui';

interface DateSelectProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'day-month-year' | 'month-year';
  className?: string;
  disabled?: boolean;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const emptySubscribe = () => () => {};

const DateSelect: React.FC<DateSelectProps> = ({
  value,
  onChange,
  mode = 'day-month-year',
  disabled = false,
}) => {
  const currentYear = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => 2025, // Fixed year for SSR/Prerender
  );

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const years = useMemo(
    () => Array.from({ length: 50 }, (_, i) => currentYear - i),
    [currentYear],
  );

  const formatMonth = (monthIndex: number) => {
    return monthNames[monthIndex];
  };

  const handleDayChange = (day: number) => {
    const newDate = new Date(value);
    newDate.setDate(day);
    onChange(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(value);
    newDate.setMonth(month);
    onChange(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(value);
    newDate.setFullYear(year);
    onChange(newDate);
  };

  return (
    <div
      className={twMerge(
        'grid',
        mode === 'day-month-year' ? 'grid-cols-3' : 'grid-cols-2',
        'w-full gap-2 ${className}',
      )}
    >
      {mode === 'day-month-year' && (
        <Dropdown
          trigger={
            <Button
              className='w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-muted disabled:cursor-not-allowed'
              disabled={disabled}
            >
              {value.getDate()}
            </Button>
          }
          matchTriggerWidth
        >
          {days.map((day) => (
            <DropdownItem
              key={day}
              isActive={day === value.getDate()}
              className='justify-left text-left'
              onClick={() => handleDayChange(day)}
            >
              {day}
            </DropdownItem>
          ))}
        </Dropdown>
      )}

      <Dropdown
        trigger={
          <Button
            className='w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-muted disabled:cursor-not-allowed'
            disabled={disabled}
          >
            {formatMonth(value.getMonth())}
          </Button>
        }
        matchTriggerWidth
      >
        {months.map((month) => (
          <DropdownItem
            key={month}
            isActive={month === value.getMonth()}
            className='justify-left text-left'
            onClick={() => handleMonthChange(month)}
          >
            {formatMonth(month)}
          </DropdownItem>
        ))}
      </Dropdown>

      <Dropdown
        trigger={
          <Button
            className='w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-muted disabled:cursor-not-allowed'
            disabled={disabled}
          >
            {value.getFullYear()}
          </Button>
        }
        matchTriggerWidth
      >
        {years.map((year) => (
          <DropdownItem
            key={year}
            isActive={year === value.getFullYear()}
            className='justify-left text-left'
            onClick={() => handleYearChange(year)}
          >
            {year}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default DateSelect;
