import { useState, useEffect } from 'react';
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  isEnabled as isDarkReaderEnabled,
  setFetchMethod,
} from 'darkreader';

export default function DarkModeWidget() {
  setFetchMethod(window.fetch);
  const [isDarkMode, setIsDarkMode] = useState(window.localStorage.getItem('quackDarkMode') === 'true');

  useEffect(() => {
    // on render use last choice
    if (isDarkMode) {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      window.localStorage.setItem('quackDarkMode', 'false');
      disableDarkMode();
    } else {
      window.localStorage.setItem('quackDarkMode', 'true');

      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'fixed',
        top: '4rem',
        right: '1.5rem',
        padding: '1rem 1rem',
        borderRadius: '2rem',
        border: 'none',
        cursor: 'pointer',
        background: isDarkMode ? '#fff' : '#333',
        color: isDarkMode ? '#fff' : '#333',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      aria-label={isDarkMode ? 'Disable dark mode' : 'Enable dark mode'}
    >
      {isDarkMode ? (
        <>
          <span>☀️</span>
        </>
      ) : (
        <>
          <span>🌙</span>
        </>
      )}
    </button>
  );
}
