import { useTheme } from '@/context/themeContext';
import { MoonIcon, SunIcon } from 'lucide-react';

export const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? (
        <SunIcon />
      ) : (
        <MoonIcon/>
      )}
      <span>Switch them</span>
    </button>
  );
};
