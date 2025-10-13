import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: number;
  isLowEndDevice: boolean;
}

export const usePerformance = (componentName?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: 0,
    isLowEndDevice: false,
  });

  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  // Detect low-end devices
  const detectLowEndDevice = useCallback(() => {
    // Check for hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;

    // Check for memory (if available)
    const memory = (navigator as any).deviceMemory;

    // Check for connection quality
    const connection = (navigator as any).connection;
    const slowConnection =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData);

    return cores <= 2 || (memory && memory <= 2) || slowConnection;
  }, []);

  // Performance observer for render timing
  useEffect(() => {
    const isLowEnd = detectLowEndDevice();

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && componentName && entry.name.includes(componentName)) {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration,
          }));
        }
      });
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['measure'] });
    }

    // Memory usage monitoring (if available)
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
        }));
      }
    };

    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    setMetrics(prev => ({
      ...prev,
      componentMountTime: Date.now() - mountTime.current,
      isLowEndDevice: isLowEnd,
    }));

    return () => {
      observer?.disconnect();
      clearInterval(memoryInterval);
    };
  }, [componentName, detectLowEndDevice]);

  // Measure render performance
  const measureRender = useCallback((measureName: string, fn: () => void) => {
    if ('performance' in window && 'mark' in performance) {
      const startMark = `${measureName}-start`;
      const endMark = `${measureName}-end`;

      performance.mark(startMark);
      fn();
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    } else {
      fn();
    }
  }, []);

  // Report performance issues
  const reportPerformanceIssue = useCallback(
    (issue: string, severity: 'low' | 'medium' | 'high') => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🚨 Performance Issue [${severity}]: ${issue}`, {
          component: componentName,
          metrics,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [componentName, metrics]
  );

  // Increment render count - track on every render but report only once at threshold
  useEffect(() => {
    renderCount.current += 1;

    // Warn only once when hitting threshold
    if (renderCount.current === 11 && process.env.NODE_ENV === 'development') {
      reportPerformanceIssue(
        `Component ${componentName} has rendered ${renderCount.current} times`,
        'medium'
      );
    }
    
    // Critical warning at 30 renders
    if (renderCount.current === 30 && process.env.NODE_ENV === 'development') {
      console.error(`🔥 CRITICAL: ${componentName} has excessive re-renders (${renderCount.current})!`);
    }
  });

  return {
    metrics,
    measureRender,
    reportPerformanceIssue,
    renderCount: renderCount.current,
  };
};

// Hook for measuring component lifecycle
export const useComponentLifecycle = (componentName: string) => {
  const mountTime = useRef<number>(performance.now());
  const [lifecycleMetrics, setLifecycleMetrics] = useState({
    mounted: false,
    mountDuration: 0,
  });

  useEffect(() => {
    const mountDuration = performance.now() - mountTime.current;
    setLifecycleMetrics({
      mounted: true,
      mountDuration,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${componentName} mounted in ${mountDuration.toFixed(2)}ms`);
    }

    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${componentName} unmounted`);
      }
    };
  }, [componentName]);

  return lifecycleMetrics;
};

// Hook for optimizing animations based on device performance
export const useOptimizedAnimation = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [preferredFrameRate, setPreferredFrameRate] = useState(60);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Adjust frame rate based on device performance
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory;

    if (cores <= 2 || (memory && memory <= 2)) {
      setPreferredFrameRate(30); // Lower frame rate for low-end devices
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    shouldReduceMotion,
    preferredFrameRate,
    // Optimized animation config
    animationConfig: {
      duration: shouldReduceMotion ? 0 : preferredFrameRate === 30 ? 0.4 : 0.3,
      ease: shouldReduceMotion ? 'linear' : 'easeOut',
    },
  };
};
