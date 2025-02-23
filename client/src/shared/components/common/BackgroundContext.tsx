import React, { createContext, useContext, useState, ReactNode } from "react";

type BackgroundContextType = {
  background: string | null;
  setBackground: (bg: string | null) => void;
};

const BackgroundContext = createContext<BackgroundContextType>({
  background: null,
  setBackground: () => {},
});

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [background, setBackground] = useState<string | null>(null);
  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
