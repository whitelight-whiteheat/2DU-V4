import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useI18n } from './I18nContext';

// Define the context type
interface A11yContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  focusVisible: boolean;
  toggleFocusVisible: () => void;
  screenReaderOnly: boolean;
  toggleScreenReaderOnly: () => void;
}

// Create the context with a default value
const A11yContext = createContext<A11yContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  fontSize: 16,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  resetFontSize: () => {},
  focusVisible: false,
  toggleFocusVisible: () => {},
  screenReaderOnly: false,
  toggleScreenReaderOnly: () => {},
});

// Create a provider component
interface A11yProviderProps {
  children: ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const { t } = useI18n();
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [focusVisible, setFocusVisible] = useState<boolean>(false);
  const [screenReaderOnly, setScreenReaderOnly] = useState<boolean>(false);

  // Initialize accessibility settings from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16', 10);
    const savedFocusVisible = localStorage.getItem('focusVisible') === 'true';
    const savedScreenReaderOnly = localStorage.getItem('screenReaderOnly') === 'true';

    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setFontSize(savedFontSize);
    setFocusVisible(savedFocusVisible);
    setScreenReaderOnly(savedScreenReaderOnly);

    // Apply initial settings
    applyHighContrast(savedHighContrast);
    applyReducedMotion(savedReducedMotion);
    applyFontSize(savedFontSize);
    applyFocusVisible(savedFocusVisible);
    applyScreenReaderOnly(savedScreenReaderOnly);
  }, []);

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    applyHighContrast(newValue);
  };

  // Apply high contrast mode
  const applyHighContrast = (value: boolean) => {
    if (value) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Toggle reduced motion
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('reducedMotion', newValue.toString());
    applyReducedMotion(newValue);
  };

  // Apply reduced motion
  const applyReducedMotion = (value: boolean) => {
    if (value) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  // Increase font size
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    applyFontSize(newSize);
  };

  // Decrease font size
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    applyFontSize(newSize);
  };

  // Reset font size
  const resetFontSize = () => {
    const defaultSize = 16;
    setFontSize(defaultSize);
    localStorage.setItem('fontSize', defaultSize.toString());
    applyFontSize(defaultSize);
  };

  // Apply font size
  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}px`;
  };

  // Toggle focus visible
  const toggleFocusVisible = () => {
    const newValue = !focusVisible;
    setFocusVisible(newValue);
    localStorage.setItem('focusVisible', newValue.toString());
    applyFocusVisible(newValue);
  };

  // Apply focus visible
  const applyFocusVisible = (value: boolean) => {
    if (value) {
      document.documentElement.classList.add('focus-visible');
    } else {
      document.documentElement.classList.remove('focus-visible');
    }
  };

  // Toggle screen reader only
  const toggleScreenReaderOnly = () => {
    const newValue = !screenReaderOnly;
    setScreenReaderOnly(newValue);
    localStorage.setItem('screenReaderOnly', newValue.toString());
    applyScreenReaderOnly(newValue);
  };

  // Apply screen reader only
  const applyScreenReaderOnly = (value: boolean) => {
    if (value) {
      document.documentElement.classList.add('screen-reader-only');
    } else {
      document.documentElement.classList.remove('screen-reader-only');
    }
  };

  // Create the context value
  const contextValue: A11yContextType = {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    focusVisible,
    toggleFocusVisible,
    screenReaderOnly,
    toggleScreenReaderOnly,
  };

  return <A11yContext.Provider value={contextValue}>{children}</A11yContext.Provider>;
};

// Create a custom hook to use the context
export const useA11y = () => useContext(A11yContext);

export default A11yContext; 