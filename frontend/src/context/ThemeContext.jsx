import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('sanctuary_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [lightBrightness, setLightBrightness] = useState(() => {
    try {
      return Number(localStorage.getItem('sanctuary_brightness_light')) || 97;
    } catch {
      return 97;
    }
  });

  const [darkDarkness, setDarkDarkness] = useState(() => {
    try {
      return Number(localStorage.getItem('sanctuary_darkness_dark')) || 9;
    } catch {
      return 9;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      const d = darkDarkness; // ranges from 3 to 18
      document.documentElement.style.setProperty('--bg-primary', `hsl(222, 20%, ${d}%)`);
      document.documentElement.style.setProperty('--bg-secondary', `hsl(222, 20%, ${d + 4}%)`);
      document.documentElement.style.setProperty('--bg-card', `hsl(222, 20%, ${d + 8}%)`);
      document.documentElement.style.setProperty('--bg-card-hover', `hsl(222, 20%, ${d + 12}%)`);
      document.documentElement.style.setProperty('--bg-elevated', `hsl(222, 20%, ${d + 14}%)`);
      document.documentElement.style.setProperty('--border', `hsl(222, 15%, ${d + 17}%)`);
      document.documentElement.style.setProperty('--bg-header', `hsla(222, 20%, ${d}%, 0.82)`);
      document.documentElement.style.setProperty('--bg-modal-glass', `hsla(222, 20%, ${d + 4}%, 0.72)`);
    } else {
      const b = lightBrightness; // ranges from 85 to 98
      document.documentElement.style.setProperty('--bg-primary', `hsl(210, 30%, ${b}%)`);
      document.documentElement.style.setProperty('--bg-secondary', `hsl(210, 30%, ${Math.min(100, b + 3)}%)`);
      document.documentElement.style.setProperty('--bg-card', `hsl(210, 20%, ${b - 4}%)`);
      document.documentElement.style.setProperty('--bg-card-hover', `hsl(210, 20%, ${b - 8}%)`);
      document.documentElement.style.setProperty('--bg-elevated', `hsl(210, 30%, ${Math.min(100, b + 3)}%)`);
      document.documentElement.style.setProperty('--border', `hsl(210, 15%, ${b - 10}%)`);
      document.documentElement.style.setProperty('--bg-header', `hsla(210, 30%, ${b}%, 0.82)`);
      document.documentElement.style.setProperty('--bg-modal-glass', `hsla(210, 30%, ${Math.min(100, b + 3)}%, 0.72)`);
    }

    try {
      localStorage.setItem('sanctuary_theme', theme);
      localStorage.setItem('sanctuary_brightness_light', String(lightBrightness));
      localStorage.setItem('sanctuary_darkness_dark', String(darkDarkness));
    } catch (e) {
      console.error(e);
    }
  }, [theme, lightBrightness, darkDarkness]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      lightBrightness,
      setLightBrightness,
      darkDarkness,
      setDarkDarkness
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
