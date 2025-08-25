import React, { memo, useCallback, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, Variants, AnimatePresence } from 'framer-motion';
import { useOptimizedAnimation } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';

// Enhanced animation variants with more sophisticated effects
export const enhancedVariants: Record<string, Variants> = {
  // Slide animations with elastic easing
  slideInLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  },
  slideInRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  },
  slideInUp: {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  },
  slideInDown: {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  },
  
  // Scale animations with bounce
  scaleIn: {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  },
  scaleBounce: {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15,
        mass: 1
      }
    }
  },
  
  // Flip animations
  flipY: {
    hidden: { rotateY: -90, opacity: 0 },
    visible: { 
      rotateY: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  flipX: {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { 
      rotateX: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  
  // Zoom with rotation
  zoomRotate: {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  },
  
  // Elastic entrance
  elastic: {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        mass: 0.8
      }
    }
  },
  
  // Typewriter effect
  typewriter: {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "auto", 
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" }
    }
  }
};

// Enhanced Reveal Component with intersection observer
interface RevealProps {
  children: React.ReactNode;
  variant?: keyof typeof enhancedVariants;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  cascade?: boolean;
  cascadeDelay?: number;
}

export const Reveal = memo<RevealProps>(({
  children,
  variant = 'slideInUp',
  delay = 0,
  duration,
  className,
  threshold = 0.1,
  triggerOnce = true,
  cascade = false,
  cascadeDelay = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, amount: threshold });
  const controls = useAnimation();
  const { shouldReduceMotion, animationConfig } = useOptimizedAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!triggerOnce) {
      controls.start("hidden");
    }
  }, [isInView, controls, triggerOnce]);

  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  const variants = enhancedVariants[variant];
  const finalDuration = duration ?? animationConfig.duration;

  if (cascade && React.isValidElement(children) && children.props.children) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: {
              staggerChildren: cascadeDelay
            }
          }
        }}
      >
        {React.Children.map(children.props.children, (child, index) => (
          <motion.div
            key={index}
            variants={variants}
            transition={{
              duration: finalDuration,
              delay: delay + (index * cascadeDelay)
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration: finalDuration,
        delay
      }}
    >
      {children}
    </motion.div>
  );
});

Reveal.displayName = 'Reveal';

// Morphing Button Component
interface MorphButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const MorphButton = memo<MorphButtonProps>(({
  children,
  className,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  const variants = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = cn(
    'relative overflow-hidden rounded-lg font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-primary/50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[size],
    className
  );

  if (shouldReduceMotion) {
    return (
      <button 
        className={baseClasses}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        y: disabled ? 0 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

MorphButton.displayName = 'MorphButton';

// Floating Action Button with micro-interactions
interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = memo<FloatingActionButtonProps>(({
  children,
  onClick,
  className,
  position = 'bottom-right'
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const baseClasses = cn(
    'fixed z-50 flex items-center justify-center',
    'w-14 h-14 rounded-full bg-primary text-primary-foreground',
    'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
    'transition-all duration-300',
    positionClasses[position],
    className
  );

  if (shouldReduceMotion) {
    return (
      <button className={baseClasses} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.1,
        rotate: 10
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

// Progress Bar with smooth animations
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
}

export const AnimatedProgress = memo<AnimatedProgressProps>(({
  value,
  max = 100,
  className,
  showValue = false,
  color = 'primary'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const { shouldReduceMotion } = useOptimizedAnimation();

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-red-500'
  };

  if (shouldReduceMotion) {
    return (
      <div className={cn('w-full bg-muted rounded-full h-2', className)}>
        <div 
          className={cn('h-2 rounded-full transition-all duration-300', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
        {showValue && (
          <span className="text-sm text-muted-foreground mt-1 block">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full bg-muted rounded-full h-2 overflow-hidden', className)}>
      <motion.div
        className={cn('h-2 rounded-full', colorClasses[color])}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {showValue && (
        <motion.span 
          className="text-sm text-muted-foreground mt-1 block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
});

AnimatedProgress.displayName = 'AnimatedProgress';

// Text animations
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  effect?: 'typewriter' | 'fade-in' | 'slide-up' | 'wave';
}

export const AnimatedText = memo<AnimatedTextProps>(({
  text,
  className,
  delay = 0,
  speed = 0.05,
  effect = 'typewriter'
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  if (effect === 'typewriter') {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + (index * speed) }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (effect === 'wave') {
    return (
      <motion.span className={className}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              delay: delay + (index * 0.1),
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const variants = {
    'fade-in': {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    'slide-up': {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  };

  return (
    <motion.span
      className={className}
      variants={variants[effect]}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.6 }}
    >
      {text}
    </motion.span>
  );
});

AnimatedText.displayName = 'AnimatedText';

// List Animations with stagger
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  variant?: keyof typeof enhancedVariants;
}

export const AnimatedList = memo<AnimatedListProps>(({
  children,
  className,
  staggerDelay = 0.1,
  variant = 'slideInUp'
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={enhancedVariants[variant]}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

AnimatedList.displayName = 'AnimatedList';

// Page Transition Wrapper
interface PageTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransitionWrapper = memo<PageTransitionWrapperProps>(({
  children,
  className
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransitionWrapper.displayName = 'PageTransitionWrapper';