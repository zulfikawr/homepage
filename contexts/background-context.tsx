'use client';

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

const BackgroundContext = createContext<{
  background: string;
  setBackground: (bg: string) => void;
}>({
  background: 'none',
  setBackground: () => {},
});

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const BackgroundProvider = ({
  children,
  initialBackground = 'none',
}: {
  children: React.ReactNode;
  initialBackground?: string;
}) => {
  const [internalBackground, setInternalBackground] =
    useState(initialBackground);

  const background = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('background') || internalBackground,
    () => initialBackground,
  );

  const setBackground = (bg: string) => {
    setInternalBackground(bg);
    localStorage.setItem('background', bg);
    // Dispatch storage event to update other tabs/components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
