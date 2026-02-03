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
  forceEmpty: false,
  toggleForceEmpty: () => {},
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
  const [internalForceEmpty, setInternalForceEmpty] = useState(false);

  const forceLoading = useSyncExternalStore(
    subscribe,
    () => {
      if (process.env.NODE_ENV !== 'development') return false;
      const stored = localStorage.getItem('forceLoading');
      return stored !== null ? stored === 'true' : internalForceLoading;
    },
    () => false,
  );

  const forceEmpty = useSyncExternalStore(
    subscribe,
    () => {
      if (process.env.NODE_ENV !== 'development') return false;
      const stored = localStorage.getItem('forceEmpty');
      return stored !== null ? stored === 'true' : internalForceEmpty;
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

  const toggleForceEmpty = () => {
    if (process.env.NODE_ENV !== 'development') return;
    const newValue = !forceEmpty;
    localStorage.setItem('forceEmpty', String(newValue));
    setInternalForceEmpty(newValue);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <LoadingContext.Provider
      value={{ forceLoading, toggleForceLoading, forceEmpty, toggleForceEmpty }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingToggle = () => useContext(LoadingContext);
