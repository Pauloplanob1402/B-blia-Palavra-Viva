import { Favorite, HistoryItem, AppSettings } from '../types';

const KEYS = {
  FAVORITES: 'bible_app_favorites',
  HISTORY: 'bible_app_history',
  SETTINGS: 'bible_app_settings',
  CACHE: 'bible_app_cache',
};

export const storageService = {
  getFavorites: (): Favorite[] => {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addFavorite: (favorite: Favorite) => {
    const favorites = storageService.getFavorites();
    const exists = favorites.some(f => f.verse.book_id === favorite.verse.book_id && f.verse.chapter === favorite.verse.chapter && f.verse.verse === favorite.verse.verse);
    if (!exists) {
      const updated = [favorite, ...favorites];
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    }
  },

  removeFavorite: (id: string) => {
    const favorites = storageService.getFavorites();
    const updated = favorites.filter(f => f.id !== id);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  },

  getHistory: (): HistoryItem[] => {
    try {
      const stored = localStorage.getItem(KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToHistory: (item: HistoryItem) => {
    const history = storageService.getHistory();
    // Remove if already exists to move to top
    const filtered = history.filter(h => !(h.bookAbbrev === item.bookAbbrev && h.chapter === item.chapter));
    const updated = [item, ...filtered].slice(0, 20); // Keep last 20
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  },

  getSettings: (defaultSettings: any): AppSettings => {
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Simple caching mechanism for chapters to enable offline reading
  cacheChapter: (key: string, data: any) => {
    try {
      const cache = JSON.parse(localStorage.getItem(KEYS.CACHE) || '{}');
      cache[key] = { data, timestamp: Date.now() };
      // Limit cache size roughly
      const keys = Object.keys(cache);
      if (keys.length > 50) {
        delete cache[keys[0]]; // Remove oldest
      }
      localStorage.setItem(KEYS.CACHE, JSON.stringify(cache));
    } catch (e) {
      console.warn("Cache quota exceeded");
    }
  },

  getCachedChapter: (key: string) => {
    try {
      const cache = JSON.parse(localStorage.getItem(KEYS.CACHE) || '{}');
      return cache[key]?.data || null;
    } catch {
      return null;
    }
  }
};
