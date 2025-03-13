'use client';

import { useState, useEffect } from 'react';
import { Icon, Button } from '@/components/UI';
import Link from 'next/link';
import { database, ref, get, set } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import Tabs, { TabItemProps } from '@/components/Tabs';

interface Appointment {
  id: string;
  name: string;
  email: string;
  purpose: string;
  date: string;
  time: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export default function ViewScheduleContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'confirmed' | 'cancelled'
  >('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const scheduleRef = ref(database, 'schedule');
      const snapshot = await get(scheduleRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const appointmentsArray: Appointment[] = Object.entries(data).map(
          ([id, appointment]: [string, Omit<Appointment, 'id'>]) => ({
            id,
            ...appointment,
          }),
        );

        setAppointments(appointmentsArray);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: 'pending' | 'confirmed' | 'cancelled',
  ) => {
    try {
      const appointmentRef = ref(database, `schedule/${appointmentId}`);
      await set(appointmentRef, {
        ...appointments.find((a) => a.id === appointmentId),
        status: newStatus,
      });

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment,
        ),
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => filter === 'all' || appointment.status === filter,
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(`${a.date}T${convertTo24Hour(a.time)}`);
      const dateB = new Date(`${b.date}T${convertTo24Hour(b.time)}`);
      return sortOrder === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  function convertTo24Hour(time12h: string) {
    const [time, modifier] = time12h.split(' ');
    let [hours] = time.split(':');
    const [minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = String(Number.parseInt(hours, 10) + 12);
    }

    return `${hours}:${minutes}:00`;
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const filterTabs: TabItemProps[] = [
    {
      key: 'all',
      label: 'All',
      action: () => setFilter('all'),
      bgColor:
        filter === 'all' ? 'bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-700',
      color: filter === 'all' ? 'text-white' : '',
    },
    {
      key: 'pending',
      label: 'Pending',
      action: () => setFilter('pending'),
      bgColor:
        filter === 'pending'
          ? 'bg-yellow-500'
          : 'bg-neutral-200 dark:bg-neutral-700',
      color: filter === 'pending' ? 'text-white' : '',
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      action: () => setFilter('confirmed'),
      bgColor:
        filter === 'confirmed'
          ? 'bg-green-500'
          : 'bg-neutral-200 dark:bg-neutral-700',
      color: filter === 'confirmed' ? 'text-white' : '',
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      action: () => setFilter('cancelled'),
      bgColor:
        filter === 'cancelled'
          ? 'bg-red-500'
          : 'bg-neutral-200 dark:bg-neutral-700',
      color: filter === 'cancelled' ? 'text-white' : '',
    },
  ];

  return (
    <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
      <div className='mb-4 flex items-center'>
        <div className='flex-1 items-center'>
          <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
            <span className='mr-3 inline-block'>🗓️</span>
            Scheduled Meetings
          </h1>
        </div>
        <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
          <div className='flex-1 px-5'>
            <p className='text-sm lg:text-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'>
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

      <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-4'>
        {!user ? null : (
          <>
            <div className='flex items-center mb-6'>
              <div className='flex space-x-4'>
                <Tabs items={filterTabs} />
              </div>
            </div>

            <div className='mb-4 flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                  className='rounded-md border border-neutral-300 bg-neutral-50 p-1.5 text-sm shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white'
                >
                  <option value='date'>Date</option>
                  <option value='name'>Name</option>
                </select>
                <Button
                  type='default'
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className='px-2 py-1 rounded-md bg-neutral-200 dark:bg-neutral-700 text-sm'
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
              <Button
                type='default'
                onClick={fetchAppointments}
                className='px-3 py-1 rounded-md bg-neutral-200 dark:bg-neutral-700 text-sm'
              >
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className='text-center py-10'>
                <p className='text-neutral-600 dark:text-neutral-400'>
                  Loading appointments...
                </p>
              </div>
            ) : sortedAppointments.length === 0 ? (
              <div className='text-center py-10'>
                <p className='text-neutral-600 dark:text-neutral-400'>
                  No appointments found.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-neutral-100 dark:bg-neutral-700'>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Date
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Time
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Name
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Email
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Purpose
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Status
                      </th>
                      <th className='border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-left'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className='hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      >
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          {formatDate(appointment.date)}
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          {appointment.time}
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          {appointment.name}
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          {appointment.email}
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          {appointment.purpose || '-'}
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                : appointment.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className='border border-neutral-300 dark:border-neutral-600 px-4 py-2'>
                          <div className='flex space-x-2'>
                            {appointment.status !== 'confirmed' && (
                              <Button
                                type='default'
                                onClick={() =>
                                  handleStatusChange(
                                    appointment.id,
                                    'confirmed',
                                  )
                                }
                                className='px-2 py-1 rounded-md bg-green-500 text-white text-xs'
                              >
                                Confirm
                              </Button>
                            )}
                            {appointment.status !== 'cancelled' && (
                              <Button
                                type='default'
                                onClick={() =>
                                  handleStatusChange(
                                    appointment.id,
                                    'cancelled',
                                  )
                                }
                                className='px-2 py-1 rounded-md bg-red-500 text-white text-xs'
                              >
                                Cancel
                              </Button>
                            )}
                            {appointment.status !== 'pending' && (
                              <Button
                                type='default'
                                onClick={() =>
                                  handleStatusChange(appointment.id, 'pending')
                                }
                                className='px-2 py-1 rounded-md bg-yellow-500 text-white text-xs'
                              >
                                Pending
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
