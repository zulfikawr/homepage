'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const EffectContext = createContext({
  effectEnabled: false,
  toggleEffect: () => {},
});

export const EffectProvider = ({ children }: { children: React.ReactNode }) => {
  const [effectEnabled, setEffectEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('effectEnabled');
    if (stored !== null) {
      setEffectEnabled(stored === 'true');
    }
  }, []);

  const toggleEffect = () => {
    setEffectEnabled((prev) => {
      const updated = !prev;
      localStorage.setItem('effectEnabled', String(updated));
      return updated;
    });
  };

  return (
    <EffectContext.Provider value={{ effectEnabled, toggleEffect }}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffectToggle = () => useContext(EffectContext);
