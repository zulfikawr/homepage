import type React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon, Button } from '~/components/UI';
import { pageLayout } from '~/components/Page';
import type { NextPageWithLayout } from '~/pages/_app';
import Link from 'next/link';
import { database, ref, set, push, get } from '~/lib/firebase';

interface Appointment {
  date: string;
  time: string;
  name: string;
  email: string;
  purpose?: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const Schedule: NextPageWithLayout = () => {
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
    <>
      <Head>
        <title>Schedule a Meeting - Zulfikar</title>
        <meta name='description' content='Schedule a meeting with Zulfikar' />
      </Head>

      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>📑</span>
              Schedule
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <p className='text-xl text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 size-[16px]'>
                    <Icon name='houseLine' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4'>
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
              <button
                onClick={() => handleMonthChange('prev')}
                disabled={
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                }
                className='px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 disabled:bg-gray-400 disabled:dark:bg-gray-600'
              >
                Previous
              </button>
              <span className='text-xl font-semibold dark:text-white'>
                {new Date(currentYear, currentMonth).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => handleMonthChange('next')}
                className='px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300'
              >
                Next
              </button>
            </div>

            {/* Calendar */}
            <div className='grid grid-cols-7 gap-2 rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, idx) => (
                  <div
                    key={idx}
                    className='text-center font-semibold text-sm text-gray-600 dark:text-gray-400 border-b dark:border-gray-600 pb-2'
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
                        ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600'
                        : day
                          ? 'bg-gray-300 dark:bg-gray-600 opacity-50 cursor-not-allowed'
                          : ''
                    } 
                    ${
                      day === new Date().getDate() &&
                      currentMonth === new Date().getMonth() &&
                      currentYear === new Date().getFullYear() &&
                      'border border-gray-300 dark:border-gray-500'
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
                    className='mt-2 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
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
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='purpose'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Purpose of Meeting (Optional)
                  </label>
                  <textarea
                    id='purpose'
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
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
              className='disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:dark:bg-gray-600 disabled:dark:hover:bg-gray-600'
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

Schedule.layout = pageLayout;

export default Schedule;
