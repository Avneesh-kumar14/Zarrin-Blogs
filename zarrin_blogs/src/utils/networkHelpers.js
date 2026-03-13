/**
 * Network Helpers
 * Utilities for optimizing network requests
 * Includes: debouncing, throttling, request cancellation
 */

const activeRequests = new Map();

/**
 * Debounce function
 * Delays function execution until no more calls are made within wait time
 */
export const debounce = (func, wait = 300, options = {}) => {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeout;
  let maxWaitTimeout;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading_ = leading;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    const timeWaiting = wait - (time - lastCallTime);
    timeout = setTimeout(timerExpired, timeWaiting);
  }

  function trailingEdge(time) {
    timeout = undefined;

    if (trailing_ && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    if (maxWaitTimeout !== undefined) {
      clearTimeout(maxWaitTimeout);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeout = maxWaitTimeout = undefined;
  }

  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined && leading_) {
        result = invokeFunc(lastCallTime);
      }
      if (timeout !== undefined) clearTimeout(timeout);
      if (maxWait) {
        maxWaitTimeout = setTimeout(
          () => trailingEdge(Date.now()),
          maxWait - (time - lastInvokeTime)
        );
      }
      timeout = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};

/**
 * Throttle function
 * Limits function execution to at most once per wait time
 */
export const throttle = (func, wait = 300, options = {}) => {
  const { leading = true, trailing = true } = options;
  
  let inThrottle;
  let lastRun;
  let lastFunc;

  return function (...args) {
    if (!inThrottle) {
      if (leading) {
        func.apply(this, args);
      }
      inThrottle = true;
      lastRun = Date.now();

      setTimeout(() => {
        inThrottle = false;
        if (trailing && lastFunc) {
          func.apply(this, lastFunc);
          lastFunc = null;
        }
      }, wait);
    } else {
      lastFunc = args;
    }
  };
};

/**
 * Abort controller wrapper for request cancellation
 */
export const createAbortableRequest = () => {
  const abortController = new AbortController();
  
  return {
    signal: abortController.signal,
    abort: () => abortController.abort(),
    isAborted: () => abortController.signal.aborted
  };
};

/**
 * Smart fetch with automatic cancellation of duplicate requests
 */
export const smartFetch = async (url, options = {}) => {
  const requestKey = `${options.method || 'GET'}_${url}`;

  // Cancel previous request if it's still pending
  if (activeRequests.has(requestKey)) {
    const prevController = activeRequests.get(requestKey);
    prevController.abort();
  }

  const controller = createAbortableRequest();
  activeRequests.set(requestKey, controller);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    activeRequests.delete(requestKey);
    return response;
  } catch (error) {
    activeRequests.delete(requestKey);
    throw error;
  }
};

/**
 * Retry mechanism with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 30000,
  backoffMultiplier = 2
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * delay * 0.1;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
};

/**
 * Batch API requests to reduce server load
 */
export class RequestBatcher {
  constructor(batchFn, batchDelay = 50, maxBatchSize = 10) {
    this.batchFn = batchFn;
    this.batchDelay = batchDelay;
    this.maxBatchSize = maxBatchSize;
    this.queue = [];
    this.timeout = null;
  }

  add(item) {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });

      if (this.queue.length >= this.maxBatchSize) {
        this.flush();
      } else if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  async flush() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.queue.length);

    try {
      const items = batch.map(b => b.item);
      const results = await this.batchFn(items);

      batch.forEach((b, idx) => {
        b.resolve(results[idx]);
      });
    } catch (error) {
      batch.forEach(b => {
        b.reject(error);
      });
    }
  }
}

/**
 * Network status monitoring
 */
export const networkStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

  onOnline: (callback) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', callback);
      return () => window.removeEventListener('online', callback);
    }
  },

  onOffline: (callback) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('offline', callback);
      return () => window.removeEventListener('offline', callback);
    }
  }
};

export default {
  debounce,
  throttle,
  createAbortableRequest,
  smartFetch,
  retryWithBackoff,
  RequestBatcher,
  networkStatus
};
