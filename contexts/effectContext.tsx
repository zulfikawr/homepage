'use client';

import React, { createContext, useContext, useState } from 'react';

const EffectContext = createContext({
  effectEnabled: false,
  toggleEffect: () => {},
});

export const EffectProvider = ({ children }: { children: React.ReactNode }) => {
  const [effectEnabled, setEffectEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('effectEnabled');
      return stored !== null ? stored === 'true' : false;
    }
    return false;
  });

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
