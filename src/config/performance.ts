/**
 * Performance Configuration
 * 
 * Central configuration for performance monitoring and debugging
 */

export const performanceConfig = {
  /**
   * Enable verbose logging for debugging
   * Set to true only when actively debugging performance issues
   */
  enableVerboseLogging: false,

  /**
   * Enable performance monitoring
   * Tracks component render counts and timing
   */
  enablePerformanceMonitoring: true,

  /**
   * Render count thresholds
   */
  renderThresholds: {
    warning: 11,    // Show warning at 11 renders
    critical: 30,   // Show critical error at 30 renders
  },

  /**
   * Auth status cache duration (ms)
   */
  authCacheDuration: {
    normal: 10000,     // 10 seconds for normal requests
    oauth2: 1000,      // 1 second for OAuth2 callbacks
  },

  /**
   * Rate limiting for auth checks (ms)
   */
  authRateLimit: {
    normal: 5000,      // 5 seconds between checks
    oauth2: 500,       // 0.5 seconds for OAuth2
  },

  /**
   * Animation settings
   */
  animations: {
    enableParticles: true,
    enableGlassEffects: true,
    enableTransitions: true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  },

  /**
   * Low-end device detection
   */
  isLowEndDevice: (() => {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection;
    
    const slowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData
    );

    return cores <= 2 || (memory && memory <= 2) || slowConnection;
  })(),
};

/**
 * Performance utilities
 */
export const performanceUtils = {
  /**
   * Log only in development with verbose mode enabled
   */
  log: (message: string, ...args: any[]) => {
    if (import.meta.env.MODE === 'development' && performanceConfig.enableVerboseLogging) {
      console.log(message, ...args);
    }
  },

  /**
   * Warn only in development
   */
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.warn(message, ...args);
    }
  },

  /**
   * Error always logs
   */
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  },

  /**
   * Measure performance of a function
   */
  measure: async <T>(name: string, fn: () => T | Promise<T>): Promise<T> => {
    if (!performanceConfig.enablePerformanceMonitoring) {
      return fn();
    }

    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      if (duration > 100 && import.meta.env.MODE === 'development') {
        performanceUtils.warn(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceUtils.error(`❌ ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  },

  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

/**
 * Export singleton instance
 */
export default performanceConfig;
