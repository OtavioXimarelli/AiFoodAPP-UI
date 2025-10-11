import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

export const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, enabled = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);

          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, enabled, hasIntersected]);

  return {
    ref: setRef,
    isIntersecting,
    hasIntersected,
  };
};

// Hook for staggered animations
export const useStaggeredAnimation = (itemCount: number, delay: number = 100) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const triggerStagger = useCallback(() => {
    // Clear existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reset visible items
    setVisibleItems(new Set());

    // Trigger staggered animation
    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, i]));
      }, i * delay);

      timeoutsRef.current.push(timeout);
    }
  }, [itemCount, delay]);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleItems(new Set());
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return {
    visibleItems,
    triggerStagger,
    reset,
    isItemVisible: (index: number) => visibleItems.has(index),
  };
};

// Hook for scroll-triggered animations with multiple elements
export const useScrollAnimation = (
  options: {
    stagger?: boolean;
    staggerDelay?: number;
    threshold?: number;
  } = {}
) => {
  const { stagger = false, staggerDelay = 100, threshold = 0.1 } = options;
  const [elements] = useState<Map<string, HTMLElement>>(new Map());
  const [visibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerElement = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (!element) return;

      elements.set(id, element);

      // Initialize observer if not exists
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              const elementId = entry.target.getAttribute('data-scroll-id');
              if (!elementId) return;

              if (entry.isIntersecting) {
                visibleElements.add(elementId);

                if (stagger) {
                  // Add staggered delay based on element order
                  const elementIndex = Array.from(elements.keys()).indexOf(elementId);
                  setTimeout(() => {
                    entry.target.classList.add('animate-in');
                  }, elementIndex * staggerDelay);
                } else {
                  entry.target.classList.add('animate-in');
                }
              }
            });
          },
          { threshold }
        );
      }

      // Add data attribute for identification
      element.setAttribute('data-scroll-id', id);
      observerRef.current.observe(element);
    },
    [elements, visibleElements, stagger, staggerDelay, threshold]
  );

  const unregisterElement = useCallback(
    (id: string) => {
      const element = elements.get(id);
      if (element && observerRef.current) {
        observerRef.current.unobserve(element);
        elements.delete(id);
        visibleElements.delete(id);
      }
    },
    [elements, visibleElements]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    registerElement,
    unregisterElement,
    isVisible: (id: string) => visibleElements.has(id),
  };
};

// Hook for parallax scrolling effects
export const useParallax = (speed: number = 0.5) => {
  const [transform, setTransform] = useState('translateY(0px)');
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      setTransform(`translateY(${rate}px)`);
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  const setRef = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  return {
    ref: setRef,
    transform,
  };
};
