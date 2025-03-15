'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button, FormLabel, Input, Textarea } from '@/components/UI';
import { database, ref, set, push, get } from '@/lib/firebase';
import PageTitle from '@/components/PageTitle';

interface Appointment {
  date: string;
  time: string;
  name: string;
  email: string;
  purpose?: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export default function ScheduleContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('09:00 AM');
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: string;
    text: string;
  } | null>(null);

  // Fetch booked slots when component mounts or month changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const scheduleRef = ref(database, 'schedule');
        const snapshot = await get(scheduleRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const slots: { [key: string]: string[] } = {};

          // Process the data to get booked slots by date
          Object.values(data).forEach((appointment: Appointment) => {
            const dateStr = appointment.date;
            const timeStr = appointment.time;

            if (!slots[dateStr]) {
              slots[dateStr] = [];
            }

            slots[dateStr].push(timeStr);
          });

          setBookedSlots(slots);
        }
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [currentMonth, currentYear]);

  // Function to generate the calendar for the current month
  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0-6 (Sunday-Saturday)

    const calendarDays = [];

    // Add empty spaces for the days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    if (day) {
      const selectedDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(selectedDate);
    }
  };

  // Handle time selection
  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  // Change month (prev/next)
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (
      direction === 'prev' &&
      (currentMonth > new Date().getMonth() ||
        currentYear > new Date().getFullYear())
    ) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: Date, time: string): boolean => {
    if (!date) return true;

    const dateStr = date.toISOString().split('T')[0];
    return !bookedSlots[dateStr] || !bookedSlots[dateStr].includes(time);
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    const allTimeSlots = [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '12:00 PM',
      '12:30 PM',
      '01:00 PM',
      '01:30 PM',
      '02:00 PM',
      '02:30 PM',
      '03:00 PM',
      '03:30 PM',
      '04:00 PM',
      '04:30 PM',
      '05:00 PM',
    ];

    if (!selectedDate) return allTimeSlots;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const bookedTimesForDate = bookedSlots[dateStr] || [];

    return allTimeSlots.filter((time) => !bookedTimesForDate.includes(time));
  };

  const handleScheduleClick = async () => {
    if (!selectedDate) {
      setSubmitMessage({ type: 'error', text: 'Please select a date' });
      return;
    }

    if (!name.trim() || !email.trim()) {
      setSubmitMessage({
        type: 'error',
        text: 'Please provide your name and email',
      });
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];

    // Check if the slot is already booked
    if (!isTimeSlotAvailable(selectedDate, selectedTime)) {
      setSubmitMessage({
        type: 'error',
        text: 'This time slot is no longer available. Please select another time.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Save the appointment to Firebase
      const scheduleRef = ref(database, 'schedule');
      const newAppointmentRef = push(scheduleRef);

      await set(newAppointmentRef, {
        name,
        email,
        purpose,
        date: dateStr,
        time: selectedTime,
        timestamp: Date.now(),
        status: 'pending', // pending, confirmed, cancelled
      });

      // Update local state to reflect the new booking
      setBookedSlots((prev) => {
        const updated = { ...prev };
        if (!updated[dateStr]) {
          updated[dateStr] = [];
        }
        updated[dateStr].push(selectedTime);
        return updated;
      });

      setSubmitMessage({
        type: 'success',
        text: 'Your meeting has been scheduled successfully!',
      });

      // Reset form
      setName('');
      setEmail('');
      setPurpose('');
      setSelectedDate(null);
      setSelectedTime('09:00 AM');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to schedule meeting. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calendarDays = generateCalendar();
  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div>
      <PageTitle
        emoji='📆'
        title='Schedule a Meeting'
        subtitle='Use this form to schedule a meeting wih me'
        route='/schedule'
      />

      <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-4'>
        {submitMessage && (
          <div
            className={`mb-4 p-3 rounded-md ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}
          >
            {submitMessage.text}
          </div>
        )}

        <div className='space-y-6'>
          <h2 className='text-lg font-semibold dark:text-white'>
            Select a Date
          </h2>

          {/* Month Navigation */}
          <div className='flex justify-between mb-4'>
            <Button
              onClick={() => handleMonthChange('prev')}
              disabled={
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear()
              }
              className='disabled:bg-neutral-400 disabled:dark:bg-neutral-600 disabled:cursor-default'
            >
              Previous
            </Button>
            <span className='text-xl font-semibold dark:text-white'>
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <Button onClick={() => handleMonthChange('next')}>Next</Button>
          </div>

          {/* Calendar */}
          <div className='grid grid-cols-7 gap-2 rounded-md border border-neutral-300 bg-neutral-50 p-2.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day, idx) => (
                <div
                  key={idx}
                  className='text-center font-semibold text-sm text-neutral-600 dark:text-neutral-400 border-b dark:border-neutral-600 pb-2'
                >
                  {day}
                </div>
              ),
            )}
            {calendarDays.map((day, idx) => {
              // Check if this day has any available slots
              let hasAvailableSlots = true;
              if (day) {
                const dateObj = new Date(
                  currentYear,
                  currentMonth,
                  day as number,
                );
                const dateStr = dateObj.toISOString().split('T')[0];
                const bookedTimesForDate = bookedSlots[dateStr] || [];
                hasAvailableSlots = bookedTimesForDate.length < 17; // 17 is the total number of time slots

                // Don't allow selecting dates in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dateObj < today) {
                  hasAvailableSlots = false;
                }
              }

              return (
                <div
                  key={idx}
                  className={`text-center p-2 ${
                    day && hasAvailableSlots
                      ? 'cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600'
                      : day
                        ? 'opacity-50 cursor-default'
                        : ''
                  } 
                  ${
                    day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear() &&
                    'border border-neutral-300 dark:border-neutral-500'
                  }
                  ${
                    selectedDate?.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear
                      ? 'bg-blue-500 text-white'
                      : ''
                  } rounded-md`}
                  onClick={() =>
                    day && hasAvailableSlots && handleDayClick(day as number)
                  }
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <>
            <div className='mt-6'>
              <h3 className='text-lg font-semibold dark:text-white'>
                Select a Time
              </h3>
              {availableTimeSlots.length > 0 ? (
                <select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className='mt-2 w-full rounded-md border border-neutral-300 bg-neutral-50 p-2.5 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
                >
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              ) : (
                <p className='mt-2 text-red-500 dark:text-red-400'>
                  No available time slots for this date.
                </p>
              )}
            </div>

            <div className='mt-6 space-y-4'>
              <h3 className='text-lg font-semibold dark:text-white'>
                Your Information
              </h3>
              <div>
                <FormLabel htmlFor='name' required>
                  Name
                </FormLabel>
                <Input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor='email' required>
                  Email
                </FormLabel>
                <Input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor='purpose'>Purpose of Meeting</FormLabel>
                <Textarea
                  id='purpose'
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className='mt-1 w-full rounded-md border border-neutral-300 bg-neutral-50 p-2.5 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
                  rows={3}
                />
              </div>
            </div>
          </>
        )}

        <div className='mt-6 flex justify-end'>
          <Button
            type='primary'
            onClick={handleScheduleClick}
            disabled={
              !selectedDate || isSubmitting || availableTimeSlots.length === 0
            }
            className='disabled:bg-neutral-400 disabled:hover:bg-neutral-400 disabled:dark:bg-neutral-600 disabled:dark:hover:bg-neutral-600 disabled:border-none'
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
}
