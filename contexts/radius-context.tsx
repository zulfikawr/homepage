'use client';

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

interface RadiusContextType {
  radius: number;
  setRadius: (val: number) => void;
}

const RadiusContext = createContext<RadiusContextType>({
  radius: 8,
  setRadius: () => {},
});

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const RadiusProvider = ({ children }: { children: React.ReactNode }) => {
  const [internalRadius, setInternalRadius] = useState(8);

  const radius = useSyncExternalStore(
    subscribe,
    () => {
      const stored = localStorage.getItem('borderRadius');
      return stored !== null ? parseInt(stored) : internalRadius;
    },
    () => 8,
  );

  const setRadius = (val: number) => {
    localStorage.setItem('borderRadius', String(val));
    setInternalRadius(val);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <RadiusContext.Provider value={{ radius, setRadius }}>
      {children}
    </RadiusContext.Provider>
  );
};

export const useRadius = () => useContext(RadiusContext);
