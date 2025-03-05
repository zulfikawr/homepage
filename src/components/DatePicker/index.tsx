import React, { useState, useEffect } from 'react';
import Dropdown from '~/components/UI/Dropdown';
import { Button } from '../UI';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate = new Date(),
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    value?.getMonth() || new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    value?.getFullYear() || new Date().getFullYear(),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
    }
  }, [value]);

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];

    // Add empty spaces for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day, 12);

    // Check if date is within allowed range
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isDateDisabled = (day: number) => {
    if (!day) return true;

    const date = new Date(currentYear, currentMonth, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    return false;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dropdown
      trigger={
        <div className='w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'>
          {selectedDate ? formatDate(selectedDate) : 'Select date'}
        </div>
      }
      position='top'
    >
      <div className='p-4 min-w-[300px]'>
        {/* Month Navigation */}
        <div className='flex justify-between mb-4 items-center'>
          <Button
            type='ghost'
            icon='caretLeft'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMonthChange('prev');
            }}
            className='hover:bg-gray-200 dark:hover:bg-gray-600'
          />
          <span className='text-lg font-semibold'>
            {new Date(currentYear, currentMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <Button
            type='ghost'
            icon='caretRight'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMonthChange('next');
            }}
            className='hover:bg-gray-200 dark:hover:bg-gray-600'
          />
        </div>

        {/* Calendar Grid */}
        <div className='grid grid-cols-7 gap-2'>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className='text-center text-sm font-medium text-gray-500 dark:text-gray-400'
            >
              {day}
            </div>
          ))}
          {generateCalendar().map((day, idx) => (
            <div
              key={idx}
              className={`
                text-center p-2 text-sm rounded-md
                ${day ? 'cursor-pointer' : ''}
                ${
                  day && !isDateDisabled(day)
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    : ''
                }
                ${
                  selectedDate?.getDate() === day &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getFullYear() === currentYear
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : ''
                }
                ${
                  isDateDisabled(day)
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : ''
                }
              `}
              onClick={() => day && !isDateDisabled(day) && handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </Dropdown>
  );
};

export default DatePicker;
