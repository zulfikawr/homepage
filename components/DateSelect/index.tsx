'use client';

import React, { useMemo } from 'react';
import { Button, Dropdown, DropdownItem, Icon } from '@/components/UI';

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

  return (
    <div
      className={`grid ${mode === 'day-month-year' ? 'grid-cols-3' : 'grid-cols-2'} w-full gap-2 ${className}`}
    >
      {mode === 'day-month-year' && (
        <Dropdown
          trigger={
            <Button
              className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
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
              <DropdownItem
                key={day}
                isActive={day === value.getDate()}
                className='justify-center text-center'
                onClick={() => handleDayChange(day)}
              >
                {day}
              </DropdownItem>
            ))}
          </div>
        </Dropdown>
      )}

      <Dropdown
        trigger={
          <Button
            className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
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
            <DropdownItem
              key={month}
              isActive={month === value.getMonth()}
              className='justify-center text-center'
              onClick={() => handleMonthChange(month)}
            >
              {formatMonth(month)}
            </DropdownItem>
          ))}
        </div>
      </Dropdown>

      <Dropdown
        trigger={
          <Button
            className='flex items-center justify-between w-full disabled:opacity-50 disabled:hover:bg-muted/50 dark:disabled:hover:bg-neutral-700 disabled:cursor-not-allowed'
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
            <DropdownItem
              key={year}
              isActive={year === value.getFullYear()}
              className='justify-center text-center'
              onClick={() => handleYearChange(year)}
            >
              {year}
            </DropdownItem>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default DateSelect;
