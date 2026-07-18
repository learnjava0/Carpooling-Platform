import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const storageKey = 'carpooling-theme';

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="theme-toggle"
      type="button"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}

export default ThemeToggle;
