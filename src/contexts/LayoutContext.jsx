import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [containerMaxWidth, setContainerMaxWidth] = useState('lg'); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false (full-width)
  const [disableGutters, setDisableGutters] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        containerMaxWidth,
        setContainerMaxWidth,
        disableGutters,
        setDisableGutters,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};
