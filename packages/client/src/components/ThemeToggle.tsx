import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getIcon = () => {
    return theme === 'dark' ? (
      <Moon className="w-5 h-5" />
    ) : (
      <Sun className="w-5 h-5" />
    );
  };

  const getTitle = () => {
    return theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={cycleTheme}
      title={getTitle()}
      aria-label={`Current theme: ${theme}. ${getTitle()}`}
    >
      {getIcon()}
    </Button>
  );
}; 