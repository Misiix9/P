/**
 * Performance Optimization Utilities for Portfolio Desktop OS
 * Includes lazy loading, memoization, virtual scrolling, and resource management
 */

import { lazy, memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';

// Lazy loading component wrapper with loading fallback
export const createLazyComponent = (importFunction, fallback = null) => {
  const LazyComponent = lazy(importFunction);
  
  const WrappedComponent = (props) => (
    <React.Suspense fallback={fallback || <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  
  return memo(WrappedComponent);
};

// Debounced value hook for search inputs
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 3
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef();

  const startIndex = useMemo(() => {
    return Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  }, [scrollTop, itemHeight, overscan]);

  const endIndex = useMemo(() => {
    return Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};

// Intersection Observer hook for lazy loading images
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Memoized image component with lazy loading
export const LazyImage = memo(({ src, alt, className, placeholder, ...props }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div ref={targetRef} className={`relative ${className}`}>
      {hasIntersected && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
      
      {(!hasIntersected || !isLoaded || hasError) && (
        <div
          className={`absolute inset-0 bg-white/10 rounded-lg flex items-center justify-center ${className}`}
        >
          {hasError ? (
            <div className="text-white/60 text-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg mx-auto mb-2" />
              <span className="text-xs">Failed to load</span>
            </div>
          ) : placeholder || (
            <div className="animate-pulse bg-white/20 rounded-lg w-full h-full" />
          )}
        </div>
      )}
    </div>
  );
});

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  const renderStartTime = useRef();

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      
      setMetrics(prev => ({
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime: (prev.averageRenderTime * prev.renderCount + renderTime) / (prev.renderCount + 1)
      }));
    }
  });

  return metrics;
};

// Resource cleanup hook
export const useResourceCleanup = (resources = []) => {
  useEffect(() => {
    return () => {
      resources.forEach(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [resources]);
};

// Optimized animation frame hook
export const useAnimationFrame = (callback, dependencies = []) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, dependencies);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Memory usage monitor
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Prefetch resource utility
export const prefetchResource = (url, type = 'fetch') => {
  if (!url) return;

  switch (type) {
    case 'image':
      const img = new Image();
      img.src = url;
      break;
    case 'fetch':
      fetch(url, { mode: 'no-cors' }).catch(() => {});
      break;
    case 'dns':
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
      break;
    default:
      break;
  }
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  const analysis = {
    scripts: scripts.map(script => ({
      src: script.src,
      size: 'Unknown'
    })),
    styles: styles.map(style => ({
      href: style.href,
      size: 'Unknown'
    }))
  };

  console.table(analysis.scripts);
  console.table(analysis.styles);

  return analysis;
};

// Component render tracker
export const withRenderTracker = (Component, componentName) => {
  return memo((props) => {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(performance.now());

    renderCount.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    lastRenderTime.current = currentTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times. Time since last render: ${timeSinceLastRender.toFixed(2)}ms`);
    }

    return <Component {...props} />;
  });
};

// Optimized event listener hook
export const useOptimizedEventListener = (eventName, handler, element = window, options = {}) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    
    element.addEventListener(eventName, eventListener, {
      passive: true,
      capture: false,
      ...options
    });

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
};

// CSS variables manager for theme switching
export const useCSSVariables = (variables) => {
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    return () => {
      Object.keys(variables).forEach(key => {
        root.style.removeProperty(key);
      });
    };
  }, [variables]);
};

// Web Worker utility
export const useWebWorker = (workerFunction) => {
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const blob = new Blob([`(${workerFunction})()`], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const newWorker = new Worker(workerUrl);

    newWorker.onerror = (error) => {
      setError(error);
      setIsLoading(false);
    };

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [workerFunction]);

  const postMessage = useCallback((data) => {
    if (worker) {
      setIsLoading(true);
      setError(null);
      
      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          setIsLoading(false);
          resolve(e.data);
        };
        
        worker.onerror = (error) => {
          setIsLoading(false);
          setError(error);
          reject(error);
        };
        
        worker.postMessage(data);
      });
    }
  }, [worker]);

  return { postMessage, isLoading, error };
};

export default {
  createLazyComponent,
  useDebounce,
  useVirtualScroll,
  useIntersectionObserver,
  LazyImage,
  usePerformanceMonitor,
  useResourceCleanup,
  useAnimationFrame,
  useMemoryMonitor,
  prefetchResource,
  analyzeBundleSize,
  withRenderTracker,
  useOptimizedEventListener,
  useCSSVariables,
  useWebWorker
};