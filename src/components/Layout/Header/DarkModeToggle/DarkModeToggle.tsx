import Toggle from '@src/components/controls/Toggle';
import { useDarkTheme } from '@src/providers/DarkThemeProvider/DarkThemeContext';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkTheme();

  return <Toggle isChecked={isDarkMode} setIsChecked={toggleDarkMode} />;
}
