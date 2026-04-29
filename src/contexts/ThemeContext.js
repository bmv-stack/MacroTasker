import React, { createContext, useContext, useState } from 'react';
import { createMMKV } from 'react-native-mmkv';
import { lightTheme, darkTheme } from '../themes/color';

export const storage = createMMKV();
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = storage.getBoolean('userTheme');
    if (saved === undefined) {
      return false;
    } else {
      return saved;
    }
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    storage.set('userTheme', newMode);
  };
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
