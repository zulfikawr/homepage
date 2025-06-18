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
  const [background, setBackground] = useState('clouds');
  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
