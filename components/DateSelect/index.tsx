'use client';

import React, { useMemo } from 'react';
import { Button, Dropdown, Icon } from '@/components/UI';

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

const DateSelect: React.FC<DateSelectProps> = ({
  value,
  onChange,
  mode = 'day-month-year',
  className = '',
  disabled = false,
}) => {
  const currentYear = new Date().getFullYear();

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

  const handleItemClick = (e: React.MouseEvent, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  return (
    <div
      className={`grid ${mode === 'day-month-year' ? 'grid-cols-3' : 'grid-cols-2'} w-full gap-2 ${className}`}
    >
      {mode === 'day-month-year' && (
        <Dropdown
          trigger={
            <Button
              className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-neutral-50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
              disabled={disabled}
            >
              {value.getDate()}
              <Icon name='caretDown' className='size-3' />
            </Button>
          }
          matchTriggerWidth
        >
          <div className='p-1 space-y-1 max-h-60 overflow-y-auto'>
            {days.map((day) => (
              <button
                key={day}
                className={`w-full text-center px-3 py-2 text-sm rounded-md ${
                  day === value.getDate()
                    ? 'bg-neutral-100 dark:bg-neutral-700'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
                onClick={(e) => handleItemClick(e, () => handleDayChange(day))}
              >
                {day}
              </button>
            ))}
          </div>
        </Dropdown>
      )}

      <Dropdown
        trigger={
          <Button
            className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-neutral-50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
            disabled={disabled}
          >
            {formatMonth(value.getMonth())}
            <Icon name='caretDown' className='size-3' />
          </Button>
        }
        matchTriggerWidth
      >
        <div className='p-1 space-y-1 max-h-60 overflow-y-auto'>
          {months.map((month) => (
            <button
              key={month}
              className={`w-full text-center px-3 py-2 text-sm rounded-md ${
                month === value.getMonth()
                  ? 'bg-neutral-100 dark:bg-neutral-700'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={(e) =>
                handleItemClick(e, () => handleMonthChange(month))
              }
            >
              {formatMonth(month)}
            </button>
          ))}
        </div>
      </Dropdown>

      <Dropdown
        trigger={
          <Button
            className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-neutral-50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
            disabled={disabled}
          >
            {value.getFullYear()}
            <Icon name='caretDown' className='size-3' />
          </Button>
        }
        matchTriggerWidth
      >
        <div className='p-1 space-y-1 max-h-60 overflow-y-auto'>
          {years.map((year) => (
            <button
              key={year}
              className={`w-full text-center px-3 py-2 text-sm rounded-md ${
                year === value.getFullYear()
                  ? 'bg-neutral-100 dark:bg-neutral-700'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={(e) => handleItemClick(e, () => handleYearChange(year))}
            >
              {year}
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default DateSelect;
