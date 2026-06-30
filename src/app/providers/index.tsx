import type { ReactNode } from 'react';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      {/* 
        This is where global providers like 
        QueryClientProvider, ThemeProvider, AuthProvider etc. will be placed 
      */}
      {children}
    </>
  );
};
