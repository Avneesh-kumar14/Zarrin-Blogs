import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * useCache Hook
 * Provides React Query-like caching for API calls
 * Supports: memory cache, localStorage, stale-while-revalidate pattern
 */

const cache = new Map();

export const useCache = (key, fetcher, options = {}) => {
  const {
    ttl = 300000, // 5 minutes default
    useLocalStorage = false,
    staleWhileRevalidate = true,
    enabled = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!enabled ? false : true);
  const [error, setError] = useState(null);
  const cacheTimerRef = useRef(null);

  // Get cached data
  const getCachedData = useCallback(() => {
    // Check memory cache first
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      } else {
        cache.delete(key);
      }
    }

    // Check localStorage
    if (useLocalStorage) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const { data, timestamp } = JSON.parse(stored);
          if (Date.now() - timestamp < ttl) {
            return data;
          }
          localStorage.removeItem(`cache_${key}`);
        }
      } catch (err) {
        console.error('Error reading from localStorage:', err);
      }
    }

    return null;
  }, [key, ttl, useLocalStorage]);

  // Set cache data
  const setCacheData = useCallback((newData) => {
    const cacheEntry = {
      data: newData,
      timestamp: Date.now()
    };

    // Store in memory
    cache.set(key, cacheEntry);

    // Store in localStorage if enabled
    if (useLocalStorage) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
      } catch (err) {
        console.error('Error writing to localStorage:', err);
      }
    }
  }, [key, useLocalStorage]);

  // Fetch data
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = getCachedData();
        if (cached) {
          setData(cached);
          setLoading(false);
          return cached;
        }
      }

      setLoading(true);
      const result = await fetcher();
      
      setCacheData(result);
      setData(result);
      setError(null);
      setLoading(false);
      
      return result;
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err);
      setLoading(false);

      // Try to use stale cache if available
      if (staleWhileRevalidate) {
        const staleData = getCachedData();
        if (staleData) {
          setData(staleData);
          console.warn('Using stale cached data due to fetch error');
          return staleData;
        }
      }

      throw err;
    }
  }, [fetcher, getCachedData, setCacheData, staleWhileRevalidate]);

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;

    // Try to use cached data immediately
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    // Fetch new data
    fetchData();
  }, [enabled, key]);

  // Clear cache on unmount after TTL
  useEffect(() => {
    return () => {
      if (cacheTimerRef.current) {
        clearTimeout(cacheTimerRef.current);
      }
    };
  }, []);

  // Refresh function to invalidate cache
  const refreshCache = useCallback(() => {
    cache.delete(key);
    if (useLocalStorage) {
      localStorage.removeItem(`cache_${key}`);
    }
    return fetchData(true);
  }, [key, useLocalStorage, fetchData]);

  return {
    data,
    loading,
    error,
    refresh: refreshCache,
    isStale: cache.has(key) ? Date.now() - cache.get(key).timestamp > ttl : true
  };
};

/**
 * Utility function to clear all cache
 */
export const clearAllCache = () => {
  cache.clear();
  if (typeof localStorage !== 'undefined') {
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

/**
 * Utility function to clear cache for specific key
 */
export const clearCacheByKey = (key) => {
  cache.delete(key);
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(`cache_${key}`);
  }
};

export default useCache;
