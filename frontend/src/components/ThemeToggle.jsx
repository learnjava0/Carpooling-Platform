import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const KEY = 'carpooling-theme';

function getInitial() {
  const saved = localStorage.getItem(KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // default dark
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
    // Apply CSS vars for light mode override
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg', '#f5f5f7');
      document.documentElement.style.setProperty('--bg-2', '#ebebed');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-elevated', '#f0f0f2');
      document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.08)');
      document.documentElement.style.setProperty('--border-strong', 'rgba(0,0,0,0.14)');
      document.documentElement.style.setProperty('--text', '#111114');
      document.documentElement.style.setProperty('--text-2', '#4a4a55');
      document.documentElement.style.setProperty('--text-3', '#8a8a99');
    } else {
      // Remove overrides so CSS vars take effect
      document.documentElement.removeAttribute('style');
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 99,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        color: 'var(--text-2)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
      }}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

export default ThemeToggle;
