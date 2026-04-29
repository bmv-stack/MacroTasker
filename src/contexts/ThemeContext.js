import React, { createContext, useContext, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { lightTheme, darkTheme } from '../themes/color';

export const storage = new MMKV();
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return storage.getBoolean('userTheme') ?? false;
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
