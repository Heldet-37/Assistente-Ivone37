import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      )}
    </button>
  );
};