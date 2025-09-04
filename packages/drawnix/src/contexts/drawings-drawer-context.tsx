import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawingsDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawingsDrawerContext = createContext<DrawingsDrawerContextType | undefined>(undefined);

interface DrawingsDrawerProviderProps {
  children: ReactNode;
}

export const DrawingsDrawerProvider: React.FC<DrawingsDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(prev => !prev);

  const value = {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };

  return (
    <DrawingsDrawerContext.Provider value={value}>
      {children}
    </DrawingsDrawerContext.Provider>
  );
};

export const useDrawingsDrawer = () => {
  const context = useContext(DrawingsDrawerContext);
  if (context === undefined) {
    throw new Error('useDrawingsDrawer must be used within a DrawingsDrawerProvider');
  }
  return context;
};
