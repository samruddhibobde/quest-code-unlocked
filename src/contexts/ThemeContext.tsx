import React, { createContext, useContext, useState, useEffect } from 'react';
import themeArena from '@/assets/theme-arena.jpg';
import themeFantasy from '@/assets/theme-fantasy.jpg';
import themeNeon from '@/assets/theme-neon.jpg';

export type ThemeType = 'arena' | 'fantasy' | 'neon';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  background: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
}

export const themes: Record<ThemeType, ThemeConfig> = {
  arena: {
    id: 'arena',
    name: 'Futuristic Arena',
    background: themeArena,
    colors: {
      primary: '45 100% 51%',     // yellow/gold
      secondary: '0 84% 60%',     // red
      accent: '30 100% 50%',      // orange
      success: '142 71% 45%',
      warning: '45 100% 51%',
      danger: '0 84% 60%',
    },
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy Quest',
    background: themeFantasy,
    colors: {
      primary: '193 95% 68%',     // cyan/light blue
      secondary: '210 80% 60%',   // blue
      accent: '30 100% 60%',      // orange accent
      success: '142 71% 45%',
      warning: '45 100% 51%',
      danger: '0 84% 60%',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Dark',
    background: themeNeon,
    colors: {
      primary: '193 95% 68%',     // cyan/electric blue
      secondary: '262 83% 58%',   // purple
      accent: '193 100% 75%',     // bright cyan
      success: '142 71% 45%',
      warning: '45 100% 51%',
      danger: '0 84% 60%',
    },
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('codequest-theme');
    return (saved as ThemeType) || 'fantasy';
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('codequest-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const config = themes[theme];
    
    root.style.setProperty('--primary', config.colors.primary);
    root.style.setProperty('--secondary', config.colors.secondary);
    root.style.setProperty('--accent', config.colors.accent);
    root.style.setProperty('--success', config.colors.success);
    root.style.setProperty('--destructive', config.colors.danger);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
