import React, { createContext, useContext, useState } from 'react';

const EffectContext = createContext({
  effectEnabled: true,
  toggleEffect: () => {},
});

export const EffectProvider = ({ children }: { children: React.ReactNode }) => {
  const [effectEnabled, setEffectEnabled] = useState(true);
  const toggleEffect = () => setEffectEnabled((prev) => !prev);

  return (
    <EffectContext.Provider value={{ effectEnabled, toggleEffect }}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffectToggle = () => useContext(EffectContext);
