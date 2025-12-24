import { useTheme } from '@/context/themeContext';
import { MoonIcon, SunIcon } from 'lucide-react';

export const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className='fixed bottom-6 right-6 p-4 rounded-full bg-secondary shadow-xl hover:scale-110 transition-transform duration-300'
    >
      {theme === 'dark' ? (
        <SunIcon className='h-7 w-7' />
      ) : (
        <MoonIcon className='h-7 w-7' />
      )}
    </button>
  );
};
