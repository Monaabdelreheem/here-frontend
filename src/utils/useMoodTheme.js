import { useMemo } from 'react';
import { DEFAULT_THEME, STORAGE_KEYS } from '../constants';

function useMoodTheme() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.theme);
      return raw ? JSON.parse(raw) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }, []);
}

export default useMoodTheme;
