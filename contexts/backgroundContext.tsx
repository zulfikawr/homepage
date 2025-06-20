'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const BackgroundContext = createContext<{
  background: string;
  setBackground: (bg: string) => void;
}>({
  background: 'clouds',
  setBackground: () => {},
});

export const BackgroundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [background, setBackgroundState] = useState('clouds');

  useEffect(() => {
    const stored = localStorage.getItem('background');
    if (stored) {
      setBackgroundState(stored);
    }
  }, []);

  const setBackground = (bg: string) => {
    setBackgroundState(bg);
    localStorage.setItem('background', bg);
  };

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
