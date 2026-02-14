const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const getCache = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (e) {
    console.error(`Error parsing cache for key ${key}`, e);
    return null;
  }
};

export const setCache = <T>(key: string, data: T): void => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(entry));
};

export const clearCache = (key: string): void => {
  localStorage.removeItem(key);
};
