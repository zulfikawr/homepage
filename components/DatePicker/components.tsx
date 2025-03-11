import React, { useState, useEffect } from 'react';
import { Button } from '@/components/UI';
import Separator from '@/components/UI/Separator';
import { CalendarStore } from './index';
import { modal } from '@/components/Modal';

interface CalendarModalProps {
  isRange: boolean;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  handleDayClick: (day: number) => void;
  isDateDisabled: (day: number) => boolean;
  isDateInRange: (day: number) => boolean;
  selectingEnd: boolean;
  disabled?: boolean;
  calendarStore: CalendarStore;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isRange,
  selectedStartDate,
  selectedEndDate,
  handleDayClick,
  isDateDisabled,
  isDateInRange,
  selectingEnd,
  disabled,
  calendarStore,
}) => {
  const [{ month, year }, setCalendarState] = useState(
    calendarStore.getState(),
  );

  useEffect(() => {
    return calendarStore.subscribe(() => {
      setCalendarState(calendarStore.getState());
    });
  }, [calendarStore]);

  const generateCalendar = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    return calendarDays;
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const currentState = calendarStore.getState();
    if (direction === 'prev') {
      if (currentState.month === 0) {
        calendarStore.setState({
          month: 11,
          year: currentState.year - 1,
        });
      } else {
        calendarStore.setState({
          ...currentState,
          month: currentState.month - 1,
        });
      }
    } else {
      if (currentState.month === 11) {
        calendarStore.setState({
          month: 0,
          year: currentState.year + 1,
        });
      } else {
        calendarStore.setState({
          ...currentState,
          month: currentState.month + 1,
        });
      }
    }
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>
          {isRange
            ? selectingEnd
              ? 'Select End Date'
              : 'Select Start Date'
            : 'Select Date'}
        </h2>
        <Button icon='close' onClick={() => modal.close()} />
      </div>

      <Separator />

      {isRange && selectingEnd && selectedStartDate && (
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-5'>
          Start date:{' '}
          {selectedStartDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}

      <div className='min-w-[300px]'>
        <div className='flex justify-between items-center mb-5'>
          <Button
            type='ghost'
            icon='caretLeft'
            onClick={() => handleMonthChange('prev')}
            className='hover:bg-gray-200 dark:hover:bg-gray-600'
          />
          <span className='text-lg font-semibold'>
            {new Date(year, month).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <Button
            type='ghost'
            icon='caretRight'
            onClick={() => handleMonthChange('next')}
            className='hover:bg-gray-200 dark:hover:bg-gray-600'
          />
        </div>

        <div className='grid grid-cols-7 gap-2 border dark:border-gray-600 rounded-md px-2 py-4'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'
            >
              {day}
            </div>
          ))}
          <div className='col-span-7 -mx-2'>
            <Separator margin='1' />
          </div>
          {generateCalendar().map((day, idx) => (
            <div
              key={idx}
              className={`
                text-center px-2 py-3 text-sm rounded-md
                ${day ? 'cursor-pointer' : ''}
                ${day && !isDateDisabled(day) ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
                ${isDateInRange(day) ? 'bg-blue-100 dark:bg-blue-900' : ''}
                ${
                  (selectedStartDate?.getDate() === day &&
                    selectedStartDate.getMonth() === month &&
                    selectedStartDate.getFullYear() === year) ||
                  (selectedEndDate?.getDate() === day &&
                    selectedEndDate.getMonth() === month &&
                    selectedEndDate.getFullYear() === year)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : ''
                }
                ${isDateDisabled(day) ? 'text-gray-400 dark:text-gray-600 cursor-default' : ''}
              `}
              onClick={() => day && !isDateDisabled(day) && handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-between mt-5'>
        {selectingEnd && selectedStartDate && (
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Start date:{' '}
            {selectedStartDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}

        {isRange && selectingEnd && !disabled && (
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Click a date to set the end date
          </div>
        )}
      </div>
    </div>
  );
};
