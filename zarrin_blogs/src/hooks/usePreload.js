import { useEffect, useCallback } from 'react';

/**
 * usePreload Hook
 * Preloads images and API data to improve perceived performance
 */
export const usePreload = () => {
  // Preload images
  const preloadImages = useCallback((imageUrls = []) => {
    imageUrls.forEach(url => {
      if (!url) return;
      
      const img = new Image();
      img.src = url;
      img.onload = () => console.log('✅ Image preloaded:', url);
      img.onerror = () => console.warn('⚠️ Failed to preload image:', url);
    });
  }, []);

  // Prefetch API data
  const prefetchData = useCallback(async (endpoints = []) => {
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          credentials: 'include',
          priority: 'low' // Low priority to not block user interactions
        });
        
        if (response.ok) {
          const data = await response.json();
          results.push({ endpoint, success: true, data });
          console.log('✅ Data prefetched:', endpoint);
        }
      } catch (error) {
        results.push({ endpoint, success: false, error: error.message });
        console.warn('⚠️ Failed to prefetch:', endpoint);
      }
    }

    return results;
  }, []);

  // DNS prefetch
  const dnsPrefetch = useCallback((domains = []) => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
      console.log('✅ DNS prefetched:', domain);
    });
  }, []);

  // Preconnect (DNS + TCP)
  const preconnect = useCallback((domains = []) => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      console.log('✅ Preconnected:', domain);
    });
  }, []);

  // Prefetch stylesheet
  const prefetchStylesheet = useCallback((href) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
    console.log('✅ Stylesheet prefetched:', href);
  }, []);

  // Prefetch script
  const prefetchScript = useCallback((src) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
    console.log('✅ Script prefetched:', src);
  }, []);

  return {
    preloadImages,
    prefetchData,
    dnsPrefetch,
    preconnect,
    prefetchStylesheet,
    prefetchScript
  };
};

/**
 * useRequestIdleCallback Hook
 * Executes callbacks during browser idle time
 */
export const useRequestIdleCallback = (callback, options = {}) => {
  useEffect(() => {
    if (typeof requestIdleCallback === 'undefined') {
      // Fallback for browsers that don't support requestIdleCallback
      const timer = setTimeout(callback, 2000);
      return () => clearTimeout(timer);
    }

    const id = requestIdleCallback(callback, options);
    return () => cancelIdleCallback(id);
  }, []);
};

/**
 * usePrefetchNextPage Hook
 * Prefetches data for the next page/route
 */
export const usePrefetchNextPage = (nextPageUrl, dataFetcher) => {
  const { prefetchData } = usePreload();

  useEffect(() => {
    if (!nextPageUrl || !dataFetcher) return;

    // Prefetch after current page is fully loaded
    useRequestIdleCallback(() => {
      console.log('🔄 Prefetching next page:', nextPageUrl);
      prefetchData([nextPageUrl]);
    });
  }, [nextPageUrl, dataFetcher, prefetchData]);
};

/**
 * Initialize optimizations on app load
 */
export const useOptimizeResourceLoading = () => {
  const { preconnect, dnsPrefetch } = usePreload();

  useEffect(() => {
    // Preconnect to critical third-party domains
    preconnect([
      'https://zarrin-blogs-backend.onrender.com',
      'https://res.cloudinary.com'
    ]);

    // DNS prefetch to other potential domains
    dnsPrefetch([
      'https://cdn.example.com',
      'https://analytics.example.com'
    ]);
  }, []);
};

export default usePreload;
