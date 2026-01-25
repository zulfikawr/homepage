'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Icon } from '@/components/UI';
import LoadingSkeleton from './loading';
import { Card } from '@/components/Card';
import { useRadius } from '@/contexts/radiusContext';

const emptySubscribe = () => () => {};

const FlipNumber = ({ number }: { number: string }) => {
  const { radius } = useRadius();

  return (
    <div
      className='relative w-8 h-12 bg-gruv-bg/40 overflow-hidden mx-0.5'
      style={{ borderRadius: `${radius}px` }}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-xl font-mono font-bold text-gruv-fg'>
          {number}
        </span>
      </div>
    </div>
  );
};

const Separator = () => (
  <div className='mx-1 text-gruv-fg/80 text-xl font-bold'>:</div>
);

const LocationAndTime = () => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

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
    if (!mounted) return;

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
  }, [mounted]);

  if (!mounted) return <LoadingSkeleton />;

  return (
    <Card
      className={`relative w-full min-h-[120px] overflow-hidden
        ${
          isDaytime
            ? 'bg-gradient-to-br from-gruv-blue/40 to-gruv-yellow/30'
            : 'bg-gradient-to-br from-[#1d2021] to-[#32302f]'
        }
      `}
      isPreview
    >
      {isDaytime ? (
        <div className='absolute top-4 right-4 w-10 h-10 bg-gruv-yellow rounded-full' />
      ) : (
        <>
          <div className='absolute top-4 right-4 w-10 h-10 bg-gruv-fg/20 rounded-full shadow-[0_0_20px_5px_rgba(235,219,178,0.1)]' />
          <div className='absolute inset-0 overflow-hidden'>
            {stars.map((star, index) => (
              <div
                key={index}
                className='absolute bg-gruv-fg rounded-full twinkling-star'
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
              <Icon name='mapPin' className='size-5 text-gruv-aqua' />
              <h2 className='text-[15px] font-medium text-gruv-fg'>
                Jakarta, Indonesia
              </h2>
            </div>
            <div className='text-gruv-blue font-medium text-sm'>
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
                  className={`text-xs font-bold ${timeData.ampm === 'AM' ? 'text-gruv-yellow' : 'text-gruv-fg/30'}`}
                >
                  AM
                </span>
                <span
                  className={`text-xs font-bold ${timeData.ampm === 'PM' ? 'text-gruv-blue' : 'text-gruv-fg/30'}`}
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
    </Card>
  );
};

export default LocationAndTime;
