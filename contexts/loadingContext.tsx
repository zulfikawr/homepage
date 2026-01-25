'use client';

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

const LoadingContext = createContext({
  forceLoading: false,
  toggleForceLoading: () => {},
});

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [internalForceLoading, setInternalForceLoading] = useState(false);

  const forceLoading = useSyncExternalStore(
    subscribe,
    () => {
      if (process.env.NODE_ENV !== 'development') return false;
      const stored = localStorage.getItem('forceLoading');
      return stored !== null ? stored === 'true' : internalForceLoading;
    },
    () => false,
  );

  const toggleForceLoading = () => {
    if (process.env.NODE_ENV !== 'development') return;
    const newValue = !forceLoading;
    localStorage.setItem('forceLoading', String(newValue));
    setInternalForceLoading(newValue);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <LoadingContext.Provider value={{ forceLoading, toggleForceLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingToggle = () => useContext(LoadingContext);
