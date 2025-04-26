import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
        }

    }, [theme]);

    return <>{children}</>;
}; 