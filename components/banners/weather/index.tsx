'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { Card } from '@/components/ui';
import { Icon, Skeleton } from '@/components/ui';
import { useLoadingToggle } from '@/contexts/loading-context';
import { useRadius } from '@/contexts/radius-context';
import { useWeather, WeatherType } from '@/contexts/weather-context';

const WeatherStyles = () => (
  <style jsx global>{`
    @keyframes float-cloud-slow {
      0% {
        left: -40%;
      }
      100% {
        left: 100%;
      }
    }
    @keyframes float-cloud-fast {
      0% {
        left: -40%;
      }
      100% {
        left: 100%;
      }
    }

    @keyframes fall-rain {
      0% {
        transform: translateY(-20px) scaleY(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(160px) scaleY(1);
        opacity: 0;
      }
    }
    @keyframes fall-snow {
      0% {
        transform: translateY(-10px) translateX(-5px);
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      100% {
        transform: translateY(140px) translateX(5px);
        opacity: 0;
      }
    }
    @keyframes pulse-sun {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
    @keyframes lightning-flash {
      0%,
      92% {
        opacity: 0;
      }
      93% {
        opacity: 0.6;
      }
      94% {
        opacity: 0;
      }
      96% {
        opacity: 0.8;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes twinkle {
      0%,
      100% {
        opacity: 0.2;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    .animate-cloud-slow {
      animation: float-cloud-slow linear infinite;
    }
    .animate-cloud-fast {
      animation: float-cloud-fast linear infinite;
    }
    .animate-rain {
      animation: fall-rain linear infinite;
    }
    .animate-snow {
      animation: fall-snow linear infinite;
    }
    .animate-sun {
      animation: pulse-sun 4s ease-in-out infinite;
    }
    .animate-lightning {
      animation: lightning-flash 5s infinite;
    }
    .animate-twinkle {
      animation: twinkle ease-in-out infinite;
    }
  `}</style>
);

const Sun = ({ className = '' }: { className?: string }) => (
  <div className={`absolute ${className}`}>
    <div
      className='relative w-14 h-14 rounded-full z-10
      bg-gradient-to-br from-[#fabd2f] to-[#d79921]
      shadow-[inset-4px_-4px_8px_rgba(180,100,20,0.4)]
      border border-[#fabd2f]/50'
    >
      <div className='absolute top-2 left-2 w-4 h-2 rounded-[100%] bg-white/40 -rotate-45' />
    </div>

    <div className='absolute inset-0 w-14 h-14 rounded-full bg-[#fabd2f] opacity-50 animate-pulse' />

    <div className='absolute -inset-8 rounded-full bg-[#fabd2f] opacity-30 animate-sun shadow-[0_0_40px_rgba(250,189,47,0.4)]' />
  </div>
);

const Moon = ({ className = '' }: { className?: string }) => (
  <div className={`absolute ${className}`}>
    <div
      className='relative w-14 h-14 rounded-full overflow-hidden
      bg-gradient-to-br from-[#ebdbb2] to-[#928374]
      shadow-[inset-4px_-4px_10px_rgba(0,0,0,0.5)]
      border border-[#ebdbb2]/20'
    >
      <div className='absolute top-3 left-3 w-3 h-3 rounded-full bg-[#7c6f64] opacity-20' />
      <div className='absolute top-8 left-2 w-2 h-2 rounded-full bg-[#7c6f64] opacity-20' />
      <div className='absolute bottom-3 right-4 w-4 h-4 rounded-full bg-[#7c6f64] opacity-10' />
      <div className='absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-[#7c6f64] opacity-30' />
    </div>

    <div className='absolute inset-0 w-14 h-14 rounded-full bg-[#ebdbb2] opacity-10 shadow-[0_0_20px_rgba(235,219,178,0.2)]' />
  </div>
);

const Cloud = ({
  top,
  delay,
  duration,
  opacity,
  scale = 1,
  isDaytime,
  isFront = false,
  zIndex = 10,
}: {
  top: number;
  delay: number;
  duration: number;
  opacity: number;
  scale?: number;
  isDaytime: boolean;
  isFront?: boolean;
  zIndex?: number;
}) => (
  <div
    className={`absolute flex items-end ${
      isFront ? 'animate-cloud-fast' : 'animate-cloud-slow'
    } ${isDaytime ? 'text-white/90' : 'text-[#a89984]'}`}
    style={{
      top: `${top}%`,
      zIndex: zIndex,
      animationDelay: `-${delay}s`,
      animationDuration: `${duration}s`,
      opacity: opacity,
      transform: `scale(${scale})`,
    }}
  >
    <div className='w-14 h-14 rounded-full bg-current -mr-6' />
    <div className='w-20 h-20 rounded-full bg-current -mr-6 -mb-2' />
    <div className='w-12 h-12 rounded-full bg-current' />
  </div>
);

const Stars = () => {
  const stars = useMemo(() => {
    const isClient = typeof window !== 'undefined';
    return Array.from({ length: 50 }).map(() => ({
      top: isClient ? Math.random() * 80 : 0,
      left: isClient ? Math.random() * 100 : 0,
      size: isClient
        ? Math.random() > 0.8
          ? 3
          : Math.random() > 0.5
            ? 2
            : 1
        : 1,
      delay: isClient ? Math.random() * 5 : 0,
      duration: isClient ? 2 + Math.random() * 3 : 2,
    }));
  }, []);

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className='absolute bg-[#ebdbb2] rounded-full animate-twinkle'
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </>
  );
};

const RainDrops = ({
  count,
  color,
  type = 'rain',
}: {
  count: number;
  color: string;
  type?: 'rain' | 'snow';
}) => {
  const drops = useMemo(() => {
    const isClient = typeof window !== 'undefined';
    return Array.from({ length: count }).map(() => ({
      left: isClient ? Math.random() * 100 : 0,
      delay: isClient ? Math.random() * 2 : 0,
      duration: isClient
        ? type === 'snow'
          ? 2 + Math.random() * 3
          : 0.5 + Math.random() * 0.5
        : 2,
    }));
  }, [count, type]);

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {drops.map((drop, i) => (
        <div
          key={i}
          className={`absolute ${type === 'rain' ? 'w-[1px] h-6' : 'w-1 h-1 rounded-full'} ${type === 'rain' ? 'animate-rain' : 'animate-snow'}`}
          style={{
            left: `${drop.left}%`,
            backgroundColor: color,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            top: type === 'rain' ? -30 : -10,
            opacity: 0,
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  );
};

const WeatherVisuals = ({
  type,
  isDaytime,
}: {
  type: Exclude<WeatherType, 'auto'>;
  isDaytime: boolean;
}) => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none select-none z-0'>
      <WeatherStyles />

      {!isDaytime && (type === 'clear' || type === 'clouds') && <Stars />}

      {type === 'clouds' && (
        <>
          <Cloud
            top={10}
            delay={0}
            duration={45}
            opacity={isDaytime ? 0.6 : 0.3}
            scale={0.9}
            isDaytime={isDaytime}
            zIndex={10}
          />
          <Cloud
            top={35}
            delay={15}
            duration={50}
            opacity={isDaytime ? 0.5 : 0.2}
            scale={0.7}
            isDaytime={isDaytime}
            zIndex={10}
          />
        </>
      )}

      {(type === 'clear' || type === 'clouds') &&
        (isDaytime ? (
          <Sun className='top-4 right-8 z-20' />
        ) : (
          <Moon className='top-6 right-10 z-20' />
        ))}

      {type === 'clouds' && (
        <>
          <Cloud
            top={2}
            delay={8}
            duration={25}
            opacity={isDaytime ? 0.8 : 0.5}
            scale={1.3}
            isDaytime={isDaytime}
            isFront
            zIndex={30}
          />

          <Cloud
            top={50}
            delay={2}
            duration={30}
            opacity={isDaytime ? 0.7 : 0.4}
            scale={1.1}
            isDaytime={isDaytime}
            isFront
            zIndex={30}
          />
        </>
      )}

      {type === 'fog' && (
        <div
          className={`absolute inset-0 z-40 ${isDaytime ? 'bg-white/40' : 'bg-[#928374]/30'}`}
        >
          <Cloud
            top={20}
            delay={0}
            duration={60}
            opacity={0.4}
            scale={2}
            isDaytime={isDaytime}
          />
        </div>
      )}

      {type === 'drizzle' && (
        <>
          <Cloud
            top={-5}
            delay={2}
            duration={30}
            opacity={isDaytime ? 0.9 : 0.4}
            isDaytime={isDaytime}
            zIndex={30}
          />
          <div className='z-40 absolute inset-0'>
            <RainDrops count={30} color={isDaytime ? '#83a598' : '#458588'} />
          </div>
        </>
      )}

      {type === 'rain' && (
        <>
          <div
            className={`absolute inset-0 z-10 ${isDaytime ? 'bg-[#458588]/20' : 'bg-black/30'}`}
          />
          <Cloud
            top={-5}
            delay={0}
            duration={25}
            opacity={isDaytime ? 1 : 0.6}
            isDaytime={isDaytime}
            scale={1.1}
            zIndex={30}
          />
          <Cloud
            top={25}
            delay={12}
            duration={28}
            opacity={isDaytime ? 0.8 : 0.4}
            isDaytime={isDaytime}
            scale={0.9}
            zIndex={10}
          />
          <div className='z-40 absolute inset-0'>
            <RainDrops count={80} color={isDaytime ? '#458588' : '#83a598'} />
          </div>
        </>
      )}

      {type === 'storm' && (
        <>
          <div className='absolute inset-0 bg-white mix-blend-overlay animate-lightning z-50 pointer-events-none' />
          <div
            className={`absolute inset-0 z-10 ${isDaytime ? 'bg-[#928374]/60' : 'bg-black/50'}`}
          />
          <Cloud
            top={-5}
            delay={0}
            duration={15}
            opacity={1}
            isDaytime={false}
            scale={1.2}
            zIndex={30}
          />
          <Cloud
            top={15}
            delay={5}
            duration={18}
            opacity={0.9}
            isDaytime={false}
            scale={1}
            zIndex={30}
          />
          <div className='z-40 absolute inset-0'>
            <RainDrops count={100} color='#ebdbb2' />
          </div>
        </>
      )}

      {type === 'snow' && (
        <>
          <div
            className={`absolute inset-0 z-10 ${isDaytime ? 'bg-white/20' : 'bg-white/5'}`}
          />
          <div className='z-40 absolute inset-0'>
            <RainDrops count={50} color='#fbf1c7' type='snow' />
          </div>
        </>
      )}
    </div>
  );
};

const emptySubscribe = () => () => {};

const FlipNumber = ({
  number,
  isDaytime,
  isLoading = false,
}: {
  number?: string;
  isDaytime: boolean;
  isLoading?: boolean;
}) => {
  const { radius } = useRadius();

  return (
    <div
      className={`relative w-8 h-12 overflow-hidden mx-0.5 z-30 ${isDaytime ? 'bg-[#fbf1c7]/40 border border-[#282828]/10' : 'bg-[#282828]/80 border border-[#ebdbb2]/10'}`}
      style={{ borderRadius: `${radius}px` }}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        {isLoading ? (
          <Skeleton width='100%' height='100%' />
        ) : (
          <span
            className={`text-xl font-mono font-bold ${isDaytime ? 'text-[#282828]' : 'text-[#ebdbb2]'}`}
          >
            {number}
          </span>
        )}
      </div>
    </div>
  );
};

const WeatherSeparator = ({
  isDaytime,
  isLoading = false,
}: {
  isDaytime: boolean;
  isLoading?: boolean;
}) => (
  <div
    className={`mx-1 text-xl font-bold z-30 drop-shadow-sm ${isDaytime ? 'text-[#282828]/90' : 'text-[#ebdbb2]/90'}`}
  >
    {isLoading ? (
      <div className='animate-pulse text-muted opacity-50'>:</div>
    ) : (
      ':'
    )}
  </div>
);

const WeatherLayout = ({
  className,
  isLoading,
  isDaytime,
  currentType,
  timeData,
  weatherData,
  weatherLabels,
}: {
  className?: string;
  isLoading: boolean;
  isDaytime: boolean;
  currentType: Exclude<WeatherType, 'auto'>;
  timeData: { hours: string; minutes: string; seconds: string; date: string };
  weatherData: { temp: number; code: number; isDay: boolean } | null;
  weatherLabels: Record<Exclude<WeatherType, 'auto'>, string>;
}) => {
  const getBgGradient = () => {
    if (isLoading) return 'from-muted/20 to-muted/10';
    if (currentType === 'storm') return 'from-[#3c3836] to-[#1d2021]';
    if (currentType === 'rain')
      return isDaytime
        ? 'from-[#458588] to-[#83a598]'
        : 'from-[#1d2021] to-[#282828]';
    if (currentType === 'snow')
      return isDaytime
        ? 'from-[#d5c4a1] to-[#ebdbb2]'
        : 'from-[#282828] to-[#3c3836]';
    if (!isDaytime) return 'from-[#1d2021] to-[#282828]';
    return 'from-[#8ec07c] to-[#fabd2f]';
  };

  return (
    <Card
      className={`${className || ''} bg-gradient-to-br ${getBgGradient()} transition-all duration-1000 min-h-[120px]`}
      isPreview
    >
      {!isLoading && (
        <WeatherVisuals type={currentType} isDaytime={isDaytime} />
      )}

      <div className='relative h-full flex flex-col z-30 gap-y-4 px-4 py-3'>
        {/* Header */}
        <div className='flex w-full items-center justify-between pointer-events-none'>
          <div
            className={`flex items-center gap-x-2 px-3 py-1.5 rounded-full shadow-sm border border-white/10 transition-colors ${
              isDaytime
                ? 'bg-[#fbf1c7]/40 text-[#282828]'
                : 'bg-[#282828]/80 text-[#ebdbb2]'
            }`}
          >
            {isLoading ? (
              <>
                <Skeleton width={20} height={20} className='rounded-full' />
                <Skeleton width={80} height={16} />
              </>
            ) : (
              <>
                <Icon name='mapPin' className='size-5' />
                <h2 className='font-bold text-sm tracking-wide'>Jakarta, ID</h2>
              </>
            )}
          </div>

          <div
            className={`flex items-center px-3 py-1.5 rounded-full shadow-sm border border-white/10 text-xs font-bold transition-colors ${
              isDaytime
                ? 'bg-[#fbf1c7]/40 text-[#282828]'
                : 'bg-[#282828]/80 text-[#ebdbb2]'
            }`}
          >
            {isLoading ? <Skeleton width={70} height={14} /> : timeData.date}
          </div>
        </div>

        {/* Center: Time Display */}
        <div className='flex-1 flex items-center justify-center w-full pointer-events-none'>
          <div className='flex items-center'>
            <FlipNumber
              number={timeData.hours}
              isDaytime={isDaytime}
              isLoading={isLoading}
            />
            <WeatherSeparator isDaytime={isDaytime} isLoading={isLoading} />
            <FlipNumber
              number={timeData.minutes}
              isDaytime={isDaytime}
              isLoading={isLoading}
            />
            <WeatherSeparator isDaytime={isDaytime} isLoading={isLoading} />
            <FlipNumber
              number={timeData.seconds}
              isDaytime={isDaytime}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer: Weather Info */}
        <div className='flex justify-center pointer-events-none h-6 leading-6'>
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/10 flex items-center gap-2 ${isDaytime ? 'bg-[#fbf1c7]/40 text-[#282828]' : 'bg-[#282828]/80 text-[#ebdbb2]'}`}
          >
            {isLoading ? (
              <>
                <Skeleton width={64} height={12} />
                <span className='opacity-50 text-muted'>|</span>
                <Skeleton width={32} height={12} />
              </>
            ) : (
              <>
                <span className='drop-shadow-sm'>
                  {weatherLabels[currentType]}
                </span>
                {weatherData && (
                  <>
                    <span className='opacity-50'>|</span>
                    <span className='drop-shadow-sm'>
                      {Math.round(weatherData.temp)}°C
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[1]' />
    </Card>
  );
};

const WeatherBanner = ({ className }: { className?: string }) => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const { forceLoading } = useLoadingToggle();
  const { weatherOverride, isDaytimeOverride } = useWeather();

  const [timeData, setTimeData] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: '',
    date: '',
  });

  const [weatherData, setWeatherData] = useState<{
    temp: number;
    code: number;
    isDay: boolean;
  } | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,weather_code,is_day&timezone=Asia/Jakarta',
        );
        interface WeatherApiResponse {
          current: {
            temperature_2m: number;
            weather_code: number;
            is_day: number;
          };
        }
        const data = (await res.json()) as WeatherApiResponse;
        setWeatherData({
          temp: data.current.temperature_2m,
          code: data.current.weather_code,
          isDay: data.current.is_day === 1,
        });
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000);

    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      });
      const [hrs, mins, secs] = timeStr.split(':');
      setTimeData({
        hours: hrs,
        minutes: mins,
        seconds: secs,
        ampm: '',
        date: now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        }),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(weatherInterval);
    };
  }, [mounted]);

  const isLoading = !mounted || forceLoading;

  const isDaytime =
    isDaytimeOverride === 'auto'
      ? weatherData
        ? weatherData.isDay
        : true
      : isDaytimeOverride === 'day';

  const currentType: Exclude<WeatherType, 'auto'> =
    weatherOverride === 'auto'
      ? weatherData
        ? (() => {
            const code = weatherData.code;
            if (code === 0) return 'clear';
            if ([1, 2, 3].includes(code)) return 'clouds';
            if ([45, 48].includes(code)) return 'fog';
            if ([51, 53, 55].includes(code)) return 'drizzle';
            if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
            if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
            if ([95, 96, 99].includes(code)) return 'storm';
            return 'clear';
          })()
        : 'clear'
      : weatherOverride;

  const weatherLabels: Record<Exclude<WeatherType, 'auto'>, string> = {
    clear: 'Clear',
    clouds: 'Cloudy',
    fog: 'Foggy',
    drizzle: 'Drizzle',
    rain: 'Rainy',
    snow: 'Snowy',
    storm: 'Stormy',
  };

  return (
    <WeatherLayout
      className={className}
      isLoading={isLoading}
      isDaytime={isDaytime}
      currentType={currentType}
      timeData={timeData}
      weatherData={weatherData}
      weatherLabels={weatherLabels}
    />
  );
};

export default WeatherBanner;
