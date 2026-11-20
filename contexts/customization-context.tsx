'use client';

import { createContext, useContext } from 'react';

export interface SiteDefaults {
  theme: string;
  background: string;
  radius: number;
}

const SiteDefaultsContext = createContext<SiteDefaults>({
  theme: 'system',
  background: 'none',
  radius: 8,
});

export const SiteDefaultsProvider = ({
  value,
  children,
}: {
  value: SiteDefaults;
  children: React.ReactNode;
}) => {
  return (
    <SiteDefaultsContext.Provider value={value}>
      {children}
    </SiteDefaultsContext.Provider>
  );
};

export const useSiteDefaults = () => useContext(SiteDefaultsContext);
