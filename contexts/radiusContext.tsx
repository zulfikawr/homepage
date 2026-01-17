'use client';

import React, { createContext, useContext, useState } from 'react';

interface RadiusContextType {
  radius: number;
  setRadius: (val: number) => void;
}

const RadiusContext = createContext<RadiusContextType>({
  radius: 8,
  setRadius: () => {},
});

export const RadiusProvider = ({ children }: { children: React.ReactNode }) => {
  const [radius, setRadiusState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('borderRadius');
      return stored !== null ? parseInt(stored) : 8;
    }
    return 8;
  });

  const setRadius = (val: number) => {
    localStorage.setItem('borderRadius', String(val));
    setRadiusState(val);
  };

  return (
    <RadiusContext.Provider value={{ radius, setRadius }}>
      {children}
    </RadiusContext.Provider>
  );
};

export const useRadius = () => useContext(RadiusContext);
