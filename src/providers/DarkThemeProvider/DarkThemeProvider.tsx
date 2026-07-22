import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { LS_KEY_THEME } from '@src/common/constants';
import { useLocalStorage } from '@src/hooks/useLocalStorage';
import { DarkThemeContext, type DarkThemeContextValue } from './DarkThemeContext';

const THEME_OPTIONS = { dark: 'dark', light: 'light' };

type DarkThemeProviderProps = PropsWithChildren;

export default function DarkThemeProvider(props: DarkThemeProviderProps) {
  const { children } = props;

  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage(LS_KEY_THEME);

  // all useStates:
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_OPTIONS.dark
      : THEME_OPTIONS.light;

    const currentTheme = localStorageTheme || deviceTheme;

    document.body.setAttribute('class', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);

    return currentTheme === THEME_OPTIONS.dark;
  });

  const toggleDarkMode = useCallback(() => {
    const newTheme = isDarkMode ? THEME_OPTIONS.light : THEME_OPTIONS.dark;
    const newIsDarkMode = !isDarkMode;

    setLocalStorageTheme(newTheme);

    document.body.setAttribute('class', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    setIsDarkMode(newIsDarkMode);

    return newIsDarkMode;
  }, [isDarkMode, setIsDarkMode, setLocalStorageTheme]);

  const value: DarkThemeContextValue = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode, toggleDarkMode]);

  return <DarkThemeContext.Provider value={value}>{children}</DarkThemeContext.Provider>;
}
