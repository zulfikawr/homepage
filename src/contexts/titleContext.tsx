import React, { createContext, useContext, useState } from 'react';

type TitleContextType = {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [headerTitle, setHeaderTitle] = useState<string>('Zulfikar');

  return (
    <TitleContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};
