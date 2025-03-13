'use client';

import React from 'react';
import { modal } from '@/components/Modal';
import { CalendarModal } from './components';

export interface DatePickerProps {
  value?: { start: Date; end: Date };
  onChange: (dates: { start: Date; end: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
  disabled?: boolean;
}

interface SelectionState {
  startDate?: Date;
  endDate?: Date;
  isSelectingEnd: boolean;
  onChange?: (dates: { start: Date; end: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
}

export interface CalendarStore {
  getState: () => { month: number; year: number };
  setState: (newState: { month: number; year: number }) => void;
  subscribe: (listener: () => void) => () => void;
}

export const createCalendarStore = (): CalendarStore => {
  let listeners: (() => void)[] = [];
  let state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  return {
    getState: () => state,
    setState: (newState: typeof state) => {
      state = newState;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
};

const calendarStore = createCalendarStore();

let selectionState: SelectionState = {
  startDate: undefined,
  endDate: undefined,
  isSelectingEnd: false,
  onChange: undefined,
  minDate: undefined,
  maxDate: undefined,
  isRange: false,
};

const handleDateSelection = (day: number) => {
  const { year, month } = calendarStore.getState();
  const newDate = new Date(year, month, day);

  if (!selectionState.isRange) {
    // Single date selection
    if (selectionState.onChange) {
      selectionState.onChange({
        start: newDate,
        end: newDate,
      });
    }
    modal.close();
    return;
  }

  if (!selectionState.isSelectingEnd) {
    // Selecting start date for range
    selectionState = {
      ...selectionState,
      startDate: newDate,
      endDate: undefined,
      isSelectingEnd: true,
    };
    modal.update(
      <CalendarModal
        isRange={true}
        selectedStartDate={selectionState.startDate}
        selectedEndDate={selectionState.endDate}
        handleDayClick={handleDateSelection}
        isDateDisabled={isDateDisabled}
        isDateInRange={isDateInRange}
        selectingEnd={selectionState.isSelectingEnd}
        disabled={false}
        calendarStore={calendarStore}
      />,
    );
  } else {
    // Selecting end date for range
    if (selectionState.startDate && selectionState.onChange) {
      if (newDate < selectionState.startDate) {
        selectionState.onChange({
          start: newDate,
          end: selectionState.startDate,
        });
      } else {
        selectionState.onChange({
          start: selectionState.startDate,
          end: newDate,
        });
      }
      modal.close();
    }
  }
};

const isDateDisabled = (day: number) => {
  if (!day) return true;

  const date = new Date(
    calendarStore.getState().year,
    calendarStore.getState().month,
    day,
  );

  if (selectionState.minDate && date < selectionState.minDate) return true;
  if (selectionState.maxDate && date > selectionState.maxDate) return true;

  if (
    selectionState.isRange &&
    selectionState.isSelectingEnd &&
    selectionState.startDate
  ) {
    return date < selectionState.startDate;
  }

  return false;
};

const isDateInRange = (day: number) => {
  if (!day) return false;
  if (!selectionState.startDate || !selectionState.endDate) return false;

  const date = new Date(
    calendarStore.getState().year,
    calendarStore.getState().month,
    day,
  );

  return date >= selectionState.startDate && date <= selectionState.endDate;
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate = new Date(2000, 0, 1),
  maxDate = new Date(2100, 11, 31),
  isRange = false,
  disabled = false,
}) => {
  const openDatePicker = () => {
    if (disabled) return;

    selectionState = {
      startDate: value?.start,
      endDate: value?.end,
      isSelectingEnd: false,
      onChange: onChange,
      minDate: minDate,
      maxDate: maxDate,
      isRange: isRange,
    };

    calendarStore.setState({
      month: value?.start?.getMonth() || new Date().getMonth(),
      year: value?.start?.getFullYear() || new Date().getFullYear(),
    });

    modal.open(
      <CalendarModal
        isRange={isRange}
        selectedStartDate={selectionState.startDate}
        selectedEndDate={selectionState.endDate}
        handleDayClick={handleDateSelection}
        isDateDisabled={isDateDisabled}
        isDateInRange={isDateInRange}
        selectingEnd={selectionState.isSelectingEnd}
        disabled={false}
        calendarStore={calendarStore}
      />,
    );
  };

  return (
    <div
      onClick={openDatePicker}
      className={`w-full px-3 py-2 text-left border border-neutral-300 rounded-md bg-neutral-50
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100'}
        dark:border-neutral-600 dark:bg-neutral-700`}
    >
      {value?.start
        ? isRange
          ? `${value.start.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })} - ${
              disabled
                ? 'Present'
                : value.end?.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }) || 'Select end date'
            }`
          : value.start.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
        : `Select ${isRange ? 'date range' : 'date'}`}
    </div>
  );
};

export default DatePicker;
