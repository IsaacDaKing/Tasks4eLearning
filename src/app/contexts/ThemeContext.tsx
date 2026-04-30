import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('lms-dark') === 'true');
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('lms-fontsize') || '100'));
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('lms-highcontrast') === 'true');
  const [dyslexiaFont, setDyslexiaFont] = useState(() => localStorage.getItem('lms-dyslexia') === 'true');

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lms-dark', String(isDark));

    root.style.fontSize = `${fontSize}%`;
    localStorage.setItem('lms-fontsize', String(fontSize));

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('lms-highcontrast', String(highContrast));

    if (dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    localStorage.setItem('lms-dyslexia', String(dyslexiaFont));
  }, [isDark, fontSize, highContrast, dyslexiaFont]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleDyslexiaFont = () => setDyslexiaFont(!dyslexiaFont);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      fontSize,
      setFontSize,
      highContrast,
      toggleHighContrast,
      dyslexiaFont,
      toggleDyslexiaFont
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
