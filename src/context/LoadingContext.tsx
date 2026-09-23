import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoadingOptions, SovereignLoadingScreen } from '../components/SovereignLoadingScreen';
import { Language } from '../types';

interface LoadingContextType {
  showLoading: (options?: LoadingOptions) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode; lang: Language }> = ({ children, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState<LoadingOptions | null>(null);

  const showLoading = (options?: LoadingOptions) => {
    setLoadingOptions(options || null);
    setIsOpen(true);
  };

  const hideLoading = () => {
    setIsOpen(false);
    setLoadingOptions(null);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading: isOpen }}>
      {children}
      <SovereignLoadingScreen
        isOpen={isOpen}
        options={loadingOptions}
        lang={lang}
        onClose={hideLoading}
      />
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
