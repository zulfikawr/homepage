'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/UI';
import LoadingSkeleton from './loading';

const STAR_POSITIONS = [
  { top: '15%', left: '10%', delay: '0s' },
  { top: '25%', left: '30%', delay: '0.3s' },
  { top: '10%', left: '50%', delay: '0.6s' },
  { top: '20%', left: '70%', delay: '0.9s' },
  { top: '30%', left: '85%', delay: '1.2s' },
  { top: '45%', left: '20%', delay: '1.5s' },
  { top: '50%', left: '40%', delay: '1.8s' },
  { top: '40%', left: '60%', delay: '2.1s' },
  { top: '55%', left: '80%', delay: '2.4s' },
  { top: '65%', left: '15%', delay: '2.7s' },
  { top: '70%', left: '35%', delay: '3s' },
  { top: '60%', left: '55%', delay: '3.3s' },
  { top: '75%', left: '75%', delay: '3.6s' },
  { top: '80%', left: '90%', delay: '3.9s' },
];

const FlipNumber = ({ number }: { number: string }) => (
  <div className='relative w-8 h-12 bg-white/10 backdrop-blur-sm rounded-md overflow-hidden mx-0.5'>
    <div className='absolute inset-0 flex items-center justify-center'>
      <span className='text-xl font-mono font-bold text-white'>{number}</span>
    </div>
    <div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none' />
  </div>
);

const Separator = () => (
  <div className='mx-1 text-white/80 text-xl font-bold'>:</div>
);

const LocationAndTime = () => {
  const [mounted, setMounted] = useState(false);
  const [timeData, setTimeData] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: 'AM',
    date: '',
  });
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      setIsDaytime(hours >= 6 && hours < 18);

      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      });

      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Jakarta',
      });

      const [time, ampm] = timeStr.split(' ');
      const [hrs, mins, secs] = time.split(':');

      setTimeData({
        hours: hrs,
        minutes: mins,
        seconds: secs,
        ampm,
        date: dateStr,
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <LoadingSkeleton />;

  return (
    <div
      className={`overflow-hidden min-h-[120px] relative w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
        isDaytime
          ? 'bg-gradient-to-br from-blue-400 to-yellow-300'
          : 'bg-gradient-to-br from-[#0B1026] to-[#1B103F]'
      }`}
    >
      {/* Background Elements */}
      {isDaytime ? (
        <div className='absolute top-4 right-4 w-10 h-10 bg-yellow-300 rounded-full blur-sm animate-pulse' />
      ) : (
        <>
          <div className='absolute inset-0'>
            {STAR_POSITIONS.map((pos, i) => (
              <div
                key={i}
                className='absolute h-[2px] w-[2px] bg-white rounded-full animate-twinkle'
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: pos.delay,
                }}
              />
            ))}
          </div>
          <div className='absolute top-4 right-4 w-8 h-8 bg-gray-200/80 rounded-full blur-sm' />
        </>
      )}

      {/* Glass overlay */}
      <div className='absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-[1px]' />

      {/* Content */}
      <div className='relative z-10 p-6'>
        <div className='flex flex-col items-start space-y-4'>
          {/* Location and Date */}
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <Icon name='mapPin' className='w-5 h-5 text-white/90' />
              <h2 className='text-[15px] font-medium text-white'>
                Jakarta, Indonesia
              </h2>
            </div>
            <div className='text-white/80 text-sm font-medium'>
              {timeData.date}
            </div>
          </div>

          {/* Flip Clock */}
          <div className='flex items-center justify-center w-full'>
            <div className='flex items-center'>
              <FlipNumber number={timeData.hours} />
              <Separator />
              <FlipNumber number={timeData.minutes} />
              <Separator />
              <FlipNumber number={timeData.seconds} />
              <div className='ml-2 flex flex-col justify-between h-12'>
                <span
                  className={`text-xs font-medium ${timeData.ampm === 'AM' ? 'text-white' : 'text-white/50'}`}
                >
                  AM
                </span>
                <span
                  className={`text-xs font-medium ${timeData.ampm === 'PM' ? 'text-white' : 'text-white/50'}`}
                >
                  PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent' />
    </div>
  );
};

export default LocationAndTime;
