import { useMemo } from 'react';

const DEFAULT_THEME = {
  page: '#f6f0d7',
  cardBorder: '#d7ddcd',
  accent: '#6f8161',
};

function useMoodTheme() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem('here.moodTheme');
      return raw ? JSON.parse(raw) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }, []);
}

export default useMoodTheme;
