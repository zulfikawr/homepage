'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/UI';
import LoadingSkeleton from './loading';

const FlipNumber = ({ number }: { number: string }) => (
  <div className='relative w-8 h-12 bg-white/10 rounded-md overflow-hidden mx-0.5'>
    <div className='absolute inset-0 flex items-center justify-center'>
      <span className='text-xl font-mono font-bold text-white'>{number}</span>
    </div>
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
  const [stars, setStars] = useState<
    Array<{
      top: number;
      left: number;
      size: number;
      opacity: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setMounted(true);

    const generateStars = () => {
      const starsArray = Array.from({ length: 50 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 2,
      }));
      setStars(starsArray);
    };

    generateStars();

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
      className={`relative w-full min-h-[120px] rounded-md border shadow-sm dark:border-neutral-700 dark:bg-neutral-800 overflow-hidden
        ${
          isDaytime
            ? 'bg-gradient-to-br from-blue-400 to-yellow-300'
            : 'bg-gradient-to-br from-[#0B1026] to-[#1B103F]'
        }
      `}
    >
      {isDaytime ? (
        <div className='absolute top-4 right-4 w-10 h-10 bg-yellow-300 rounded-full' />
      ) : (
        <>
          <div className='absolute top-4 right-4 w-10 h-10 bg-white/30 rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.2)]' />
          <div className='absolute inset-0 overflow-hidden'>
            {stars.map((star, index) => (
              <div
                key={index}
                className='absolute bg-white rounded-full twinkling-star'
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className='relative px-4.5 py-2.5'>
        <div className='flex flex-col items-start space-y-4'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <Icon name='mapPin' className='size-5 text-white' />
              <h2 className='text-[15px] font-medium text-white'>
                Jakarta, Indonesia
              </h2>
            </div>
            <div className='text-white/80 text-sm font-medium'>
              {timeData.date}
            </div>
          </div>

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

      <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent' />

      <style jsx>{`
        .twinkling-star {
          animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationAndTime;
