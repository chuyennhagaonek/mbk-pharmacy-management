import React, { createContext, useState, ReactNode } from 'react';

interface GlobalContextProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export const GlobalContext = createContext<GlobalContextProps>({
  theme: 'light',
  setTheme: () => {},
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  return (
    <GlobalContext.Provider value={{ theme, setTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};
