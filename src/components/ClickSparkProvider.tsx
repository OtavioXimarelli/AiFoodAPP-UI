import React, { createContext, useContext, useState } from 'react';

interface ClickSparkContextType {
  isGlobalClickSparkEnabled: boolean;
  toggleGlobalClickSpark: () => void;
}

const ClickSparkContext = createContext<ClickSparkContextType | undefined>(undefined);

export const useClickSpark = () => {
  const context = useContext(ClickSparkContext);
  if (!context) {
    throw new Error('useClickSpark must be used within a ClickSparkProvider');
  }
  return context;
};

interface ClickSparkProviderProps {
  children: React.ReactNode;
}

export const ClickSparkProvider: React.FC<ClickSparkProviderProps> = ({ children }) => {
  const [isGlobalClickSparkEnabled, setIsGlobalClickSparkEnabled] = useState(true);

  const toggleGlobalClickSpark = () => {
    setIsGlobalClickSparkEnabled(!isGlobalClickSparkEnabled);
  };

  return (
    <ClickSparkContext.Provider
      value={{
        isGlobalClickSparkEnabled,
        toggleGlobalClickSpark,
      }}
    >
      {children}
    </ClickSparkContext.Provider>
  );
};
