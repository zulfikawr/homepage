'use client';

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

const EffectContext = createContext({
  effectEnabled: false,
  toggleEffect: () => {},
});

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const EffectProvider = ({ children }: { children: React.ReactNode }) => {
  const [internalEffectEnabled, setInternalEffectEnabled] = useState(false);

  const effectEnabled = useSyncExternalStore(
    subscribe,
    () => {
      const stored = localStorage.getItem('effectEnabled');
      return stored !== null ? stored === 'true' : internalEffectEnabled;
    },
    () => false,
  );

  const toggleEffect = () => {
    const newValue = !effectEnabled;
    localStorage.setItem('effectEnabled', String(newValue));
    setInternalEffectEnabled(newValue);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <EffectContext.Provider value={{ effectEnabled, toggleEffect }}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffectToggle = () => useContext(EffectContext);
