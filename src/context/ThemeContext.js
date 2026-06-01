import React, { createContext, useContext, useMemo } from 'react';
import { colors, getHeaderBackground, getScreenBackground } from '../services/theme';

const ThemeContext = createContext({
  role: null,
  screenBackground: colors.background,
  headerBackground: colors.primary,
  isAdmin: false,
});

export function ThemeProvider({ role, children }) {
  const value = useMemo(
    () => ({
      role,
      screenBackground: getScreenBackground(role),
      headerBackground: getHeaderBackground(role),
      isAdmin: role === 'admin',
    }),
    [role]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
