'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { Card } from '@/components/Card';
import { Icon } from '@/components/UI';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { useRadius } from '@/contexts/radiusContext';

import LoadingSkeleton from './loading';

const emptySubscribe = () => () => {};

const FlipNumber = ({
  number,
  isDaytime,
}: {
  number: string;
  isDaytime: boolean;
}) => {
  const { radius } = useRadius();

  return (
    <div
      className={`relative w-8 h-12 overflow-hidden mx-0.5 ${isDaytime ? 'bg-gruv-bg/10' : 'bg-gruv-bg/40'}`}
      style={{ borderRadius: `${radius}px` }}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <span
          className={`text-xl font-mono font-bold ${isDaytime ? 'text-gruv-bg' : 'text-gruv-fg'}`}
        >
          {number}
        </span>
      </div>
    </div>
  );
};

const Separator = ({ isDaytime }: { isDaytime: boolean }) => (
  <div
    className={`mx-1 text-xl font-bold ${isDaytime ? 'text-gruv-bg/60' : 'text-gruv-fg/80'}`}
  >
    :
  </div>
);

const LocationAndTime = () => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const { forceLoading } = useLoadingToggle();

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

  if (!mounted || forceLoading) return <LoadingSkeleton />;

  return (
    <Card
      className={`relative w-full min-h-[120px] overflow-hidden
        ${
          isDaytime
            ? 'bg-gradient-to-br from-gruv-aqua/40 to-gruv-yellow/60'
            : 'bg-gradient-to-br from-[#1d2021] to-[#32302f]'
        }
      `}
      isPreview
    >
      {isDaytime ? (
        <div className='absolute top-4 right-4 w-10 h-10 bg-gruv-orange rounded-full shadow-[0_0_30px_rgba(254,128,25,0.4)]' />
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
              <Icon
                name='mapPin'
                className={`size-5 ${isDaytime ? 'text-gruv-orange' : 'text-gruv-aqua'}`}
              />
              <h2
                className={`text-[15px] font-bold ${isDaytime ? 'text-gruv-bg' : 'text-gruv-fg'}`}
              >
                Jakarta, Indonesia
              </h2>
            </div>
            <div
              className={`font-bold text-sm ${isDaytime ? 'text-gruv-bg/70' : 'text-gruv-blue'}`}
            >
              {timeData.date}
            </div>
          </div>

          <div className='flex items-center justify-center w-full'>
            <div className='flex items-center'>
              <FlipNumber number={timeData.hours} isDaytime={isDaytime} />
              <Separator isDaytime={isDaytime} />
              <FlipNumber number={timeData.minutes} isDaytime={isDaytime} />
              <Separator isDaytime={isDaytime} />
              <FlipNumber number={timeData.seconds} isDaytime={isDaytime} />
              <div className='ml-2 flex flex-col justify-between h-12'>
                <span
                  className={`text-xs font-bold ${timeData.ampm === 'AM' ? (isDaytime ? 'text-gruv-orange' : 'text-gruv-yellow') : isDaytime ? 'text-gruv-bg/20' : 'text-gruv-fg/30'}`}
                >
                  AM
                </span>
                <span
                  className={`text-xs font-bold ${timeData.ampm === 'PM' ? (isDaytime ? 'text-gruv-blue' : 'text-gruv-blue') : isDaytime ? 'text-gruv-bg/20' : 'text-gruv-fg/30'}`}
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
