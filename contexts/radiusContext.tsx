'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface RadiusContextType {
  radius: number;
  setRadius: (val: number) => void;
}

const RadiusContext = createContext<RadiusContextType>({
  radius: 8,
  setRadius: () => {},
});

export const RadiusProvider = ({ children }: { children: React.ReactNode }) => {
  const [radius, setRadiusState] = useState(8);

  useEffect(() => {
    const stored = localStorage.getItem('borderRadius');
    if (stored !== null) {
      setRadiusState(parseInt(stored));
    }
  }, []);

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
