/**
 * Performance Monitoring
 * Tracks Core Web Vitals and custom metrics
 * Reports to analytics backends
 */

const metrics = {
  pageLoad: {},
  images: [],
  api: [],
  customEvents: []
};

/**
 * Core Web Vitals tracking
 */
export const trackCoreWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        metrics.pageLoad.lcp = lastEntry.renderTime || lastEntry.loadTime;
        console.log('📊 LCP:', metrics.pageLoad.lcp);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            metrics.pageLoad.cls = (metrics.pageLoad.cls || 0) + entry.value;
          }
        });
        console.log('📊 CLS:', metrics.pageLoad.cls);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metrics.pageLoad.fid = entry.processingDuration;
          console.log('📊 FID:', metrics.pageLoad.fid);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input', 'largest-contentful-paint'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  // First Paint / First Contentful Paint
  const perfData = window.performance.timing;
  if (perfData) {
    metrics.pageLoad.fcp = perfData.responseEnd - perfData.navigationStart;
    metrics.pageLoad.tti = perfData.loadEventEnd - perfData.navigationStart;
    console.log('📊 FCP:', metrics.pageLoad.fcp);
    console.log('📊 TTI:', metrics.pageLoad.tti);
  }
};

/**
 * Track individual image load times
 */
export const trackImageLoad = (imageSrc, loadTime) => {
  metrics.images.push({
    src: imageSrc,
    loadTime,
    timestamp: Date.now()
  });

  if (metrics.images.length % 10 === 0) {
    const avgLoadTime = metrics.images.reduce((sum, img) => sum + img.loadTime, 0) / metrics.images.length;
    console.log('📊 Average Image Load Time:', avgLoadTime.toFixed(2), 'ms');
  }
};

/**
 * Track API response times
 */
export const trackApiCall = (endpoint, duration, statusCode) => {
  metrics.api.push({
    endpoint,
    duration,
    statusCode,
    timestamp: Date.now()
  });

  if (metrics.api.length % 10 === 0) {
    const avgDuration = metrics.api.reduce((sum, call) => sum + call.duration, 0) / metrics.api.length;
    console.log('📊 Average API Response Time:', avgDuration.toFixed(2), 'ms');
  }
};

/**
 * Track custom events
 */
export const trackCustomEvent = (eventName, data = {}) => {
  const event = {
    name: eventName,
    data,
    timestamp: Date.now()
  };

  metrics.customEvents.push(event);
  console.log('📊 Custom Event:', eventName, data);

  // Send to analytics if configured
  sendMetricsToAnalytics(event);
};

/**
 * Get all collected metrics
 */
export const getMetrics = () => {
  return JSON.parse(JSON.stringify(metrics));
};

/**
 * Send metrics to analytics backend
 */
const sendMetricsToAnalytics = async (metric) => {
  try {
    // Only send if analytics URL is configured
    const analyticsUrl = process.env.REACT_APP_ANALYTICS_URL;
    if (!analyticsUrl) return;

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsUrl, JSON.stringify(metric));
    } else {
      // Fallback to fetch
      await fetch(analyticsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        keepalive: true
      });
    }
  } catch (error) {
    console.error('Error sending metrics:', error);
  }
};

/**
 * Hook for React components to track performance
 */
export const usePerformanceTracking = (componentName) => {
  const startTime = Date.now();

  return {
    trackEvent: (eventName, data) => {
      trackCustomEvent(`${componentName}:${eventName}`, {
        ...data,
        componentRenderTime: Date.now() - startTime
      });
    },
    getComponentRenderTime: () => Date.now() - startTime
  };
};

/**
 * Report metrics to console in a formatted way
 */
export const reportMetrics = () => {
  console.group('📊 Performance Metrics Report');

  const allMetrics = getMetrics();

  console.group('Core Web Vitals (ms)');
  console.table(allMetrics.pageLoad);
  console.groupEnd();

  if (allMetrics.images.length > 0) {
    console.group('Image Load Times');
    const imageSummary = {
      totalImages: allMetrics.images.length,
      avgLoadTime: (allMetrics.images.reduce((sum, img) => sum + img.loadTime, 0) / allMetrics.images.length).toFixed(2),
      minLoadTime: Math.min(...allMetrics.images.map(img => img.loadTime)).toFixed(2),
      maxLoadTime: Math.max(...allMetrics.images.map(img => img.loadTime)).toFixed(2)
    };
    console.table(imageSummary);
    console.groupEnd();
  }

  if (allMetrics.api.length > 0) {
    console.group('API Performance');
    const apiSummary = {
      totalCalls: allMetrics.api.length,
      avgDuration: (allMetrics.api.reduce((sum, call) => sum + call.duration, 0) / allMetrics.api.length).toFixed(2),
      minDuration: Math.min(...allMetrics.api.map(call => call.duration)).toFixed(2),
      maxDuration: Math.max(...allMetrics.api.map(call => call.duration)).toFixed(2),
      errorRate: ((allMetrics.api.filter(call => call.statusCode >= 400).length / allMetrics.api.length) * 100).toFixed(2) + '%'
    };
    console.table(apiSummary);
    console.groupEnd();
  }

  console.groupEnd();
};

/**
 * Measure Network Information (if available)
 */
export const getNetworkInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return null;
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // milliseconds
    saveData: connection.saveData // boolean
  };
};

// Initialize tracking on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    trackCoreWebVitals();
    console.log('📊 Performance monitoring initialized');
  });

  // Send metrics before page unload
  window.addEventListener('beforeunload', () => {
    reportMetrics();
  });
}

export default {
  trackCoreWebVitals,
  trackImageLoad,
  trackApiCall,
  trackCustomEvent,
  getMetrics,
  reportMetrics,
  usePerformanceTracking,
  getNetworkInfo
};
