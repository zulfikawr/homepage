'use client';

import React, { createContext, useContext, useState } from 'react';

export type WeatherType =
  | 'auto'
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'storm'
  | 'snow'
  | 'fog';

interface WeatherContextType {
  weatherOverride: WeatherType;
  setWeatherOverride: (weather: WeatherType) => void;
  isDaytimeOverride: 'auto' | 'day' | 'night';
  setIsDaytimeOverride: (mode: 'auto' | 'day' | 'night') => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [weatherOverride, setWeatherOverride] = useState<WeatherType>('auto');
  const [isDaytimeOverride, setIsDaytimeOverride] = useState<
    'auto' | 'day' | 'night'
  >('auto');

  return (
    <WeatherContext.Provider
      value={{
        weatherOverride,
        setWeatherOverride,
        isDaytimeOverride,
        setIsDaytimeOverride,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
