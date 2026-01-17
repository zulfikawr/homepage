'use client';

import { createContext, useContext, useState } from 'react';

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
  const [background, setBackgroundState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('background');
      return stored || 'clouds';
    }
    return 'clouds';
  });

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
