import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useOptimizedAnimation } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  threshold?: number;
}

export const SwipeableCard = memo<SwipeableCardProps>(
  ({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, className, threshold = 100 }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-200, 200], [5, -5]);
    const rotateY = useTransform(x, [-200, 200], [-5, 5]);
    const { shouldReduceMotion } = useOptimizedAnimation();

    const handleDragEnd = useCallback(
      (event: any, info: PanInfo) => {
        const { offset } = info;

        if (Math.abs(offset.x) > threshold) {
          if (offset.x > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }

        if (Math.abs(offset.y) > threshold) {
          if (offset.y > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }

        // Reset position
        x.set(0);
        y.set(0);
      },
      [x, y, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]
    );

    if (shouldReduceMotion) {
      return <div className={className}>{children}</div>;
    }

    return (
      <motion.div
        className={cn('cursor-grab active:cursor-grabbing', className)}
        drag
        dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotateX, rotateY }}
        whileDrag={{ scale: 1.05, zIndex: 999 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    );
  }
);

SwipeableCard.displayName = 'SwipeableCard';

// Magnetic Button Component
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  magnetStrength?: number;
}

export const MagneticButton = memo<MagneticButtonProps>(
  ({ children, onClick, className, magnetStrength = 0.4 }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const { shouldReduceMotion } = useOptimizedAnimation();

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        x.set(distanceX * magnetStrength);
        y.set(distanceY * magnetStrength);
      },
      [x, y, magnetStrength]
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    if (shouldReduceMotion) {
      return (
        <button ref={ref} className={className} onClick={onClick}>
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={className}
        onClick={onClick}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

// Parallax Scroll Component
interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxScroll = memo<ParallaxScrollProps>(
  ({ children, speed = 0.5, className, direction = 'up' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { shouldReduceMotion } = useOptimizedAnimation();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const scrolled = window.pageYOffset;
          const rate = scrolled * speed;

          setScrollY(rate);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    if (shouldReduceMotion) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    const transform = {
      up: `translateY(${-scrollY}px)`,
      down: `translateY(${scrollY}px)`,
      left: `translateX(${-scrollY}px)`,
      right: `translateX(${scrollY}px)`,
    };

    return (
      <div ref={ref} className={className}>
        <motion.div
          style={{ transform: transform[direction] }}
          transition={{ type: 'tween', ease: 'linear' }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

ParallaxScroll.displayName = 'ParallaxScroll';

// Ripple Effect Component
interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export const RippleEffect = memo<RippleEffectProps>(
  ({ children, className, color = 'rgba(255, 255, 255, 0.6)', duration = 600 }) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const { shouldReduceMotion } = useOptimizedAnimation();

    const addRipple = useCallback(
      (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { x, y, id }]);

        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, duration);
      },
      [duration]
    );

    if (shouldReduceMotion) {
      return (
        <div className={cn('relative overflow-hidden', className)} onClick={addRipple}>
          {children}
        </div>
      );
    }

    return (
      <div className={cn('relative overflow-hidden', className)} onClick={addRipple}>
        {children}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
            animate={{ width: 300, height: 300, opacity: [1, 0] }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }}
          />
        ))}
      </div>
    );
  }
);

RippleEffect.displayName = 'RippleEffect';

// Tilt Card Component
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxX?: number;
  tiltMaxY?: number;
  scale?: number;
  glareEnable?: boolean;
}

export const TiltCard = memo<TiltCardProps>(
  ({ children, className, tiltMaxX = 10, tiltMaxY = 10, scale = 1.02, glareEnable = true }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [tiltMaxX, -tiltMaxX]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-tiltMaxY, tiltMaxY]);
    const { shouldReduceMotion } = useOptimizedAnimation();

    const handleMouseMove = useCallback(
      (event: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
      },
      [x, y]
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    if (shouldReduceMotion) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn('relative', className)}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
        {glareEnable && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: useTransform(
                [x, y],
                ([xValue, yValue]) =>
                  `radial-gradient(circle at ${((xValue as number) + 0.5) * 100}% ${((yValue as number) + 0.5) * 100}%, rgba(255,255,255,0.2) 0%, transparent 50%)`
              ),
            }}
          />
        )}
      </motion.div>
    );
  }
);

TiltCard.displayName = 'TiltCard';

// Morphing Shape Component
interface MorphingShapeProps {
  shapes: string[];
  duration?: number;
  className?: string;
  autoPlay?: boolean;
  currentShape?: number;
}

export const MorphingShape = memo<MorphingShapeProps>(
  ({ shapes, duration = 2000, className, autoPlay = true, currentShape = 0 }) => {
    const [shapeIndex, setShapeIndex] = useState(currentShape);
    const { shouldReduceMotion } = useOptimizedAnimation();

    useEffect(() => {
      if (!autoPlay || shouldReduceMotion) return;

      const interval = setInterval(() => {
        setShapeIndex(prev => (prev + 1) % shapes.length);
      }, duration);

      return () => clearInterval(interval);
    }, [autoPlay, duration, shapes.length, shouldReduceMotion]);

    if (shouldReduceMotion) {
      return (
        <svg className={className} viewBox="0 0 100 100">
          <path d={shapes[0]} fill="currentColor" />
        </svg>
      );
    }

    return (
      <svg className={className} viewBox="0 0 100 100">
        <motion.path
          d={shapes[shapeIndex]}
          fill="currentColor"
          animate={{ d: shapes[shapeIndex] }}
          transition={{ duration: duration / 1000, ease: 'easeInOut' }}
        />
      </svg>
    );
  }
);

MorphingShape.displayName = 'MorphingShape';

// Scroll-triggered Animation Hook
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};
