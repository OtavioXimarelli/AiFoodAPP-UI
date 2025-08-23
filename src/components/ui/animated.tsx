import React, { memo } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { useOptimizedAnimation } from '@/hooks/usePerformance';
import { useIntersectionObserver } from '@/hooks/useScrollAnimation';

// Optimized animation variants
export const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 },
  },
  bounce: {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
  },
};

interface AnimatedElementProps extends MotionProps {
  children: React.ReactNode;
  variant?: keyof typeof animationVariants;
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  className?: string;
  as?: keyof typeof motion;
}

// Memoized animated element component
export const AnimatedElement = memo<AnimatedElementProps>(({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration,
  triggerOnce = true,
  className,
  as = 'div',
  ...motionProps
}) => {
  const { shouldReduceMotion, animationConfig } = useOptimizedAnimation();
  const { ref, hasIntersected, isIntersecting } = useIntersectionObserver({
    triggerOnce,
    threshold: 0.1,
  });

  const MotionComponent = motion[as];
  const variants = animationVariants[variant];
  
  const finalDuration = duration ?? animationConfig.duration;
  const isVisible = triggerOnce ? hasIntersected : isIntersecting;

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration: finalDuration,
        delay,
        ease: animationConfig.ease,
      }}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );
});

AnimatedElement.displayName = 'AnimatedElement';

// Staggered container component
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  variant?: keyof typeof animationVariants;
}

export const StaggerContainer = memo<StaggerContainerProps>(({
  children,
  className,
  staggerDelay = 0.1,
  variant = 'slideUp'
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();
  const { ref, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

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
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={animationVariants[variant]}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

StaggerContainer.displayName = 'StaggerContainer';

// Hover animation wrapper
interface HoverAnimationProps {
  children: React.ReactNode;
  scale?: number;
  y?: number;
  className?: string;
  disabled?: boolean;
}

export const HoverAnimation = memo<HoverAnimationProps>(({
  children,
  scale = 1.02,
  y = -2,
  className,
  disabled = false
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        y,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
});

HoverAnimation.displayName = 'HoverAnimation';

// Loading animation component
interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingAnimation = memo<LoadingAnimationProps>(({
  size = 'md',
  className
}) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (shouldReduceMotion) {
    return (
      <div className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full ${className}`}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
});

LoadingAnimation.displayName = 'LoadingAnimation';

// Pulse animation for skeleton loading
export const SkeletonPulse = memo<{ className?: string }>(({ className }) => {
  const { shouldReduceMotion } = useOptimizedAnimation();

  if (shouldReduceMotion) {
    return <div className={`bg-muted/50 ${className}`} />;
  }

  return (
    <motion.div
      className={`bg-muted/50 ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
});

SkeletonPulse.displayName = 'SkeletonPulse';

// Page transition wrapper
export const PageTransition = memo<{ children: React.ReactNode }>(({ children }) => {
  const { shouldReduceMotion, animationConfig } = useOptimizedAnimation();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: animationConfig.duration,
        ease: animationConfig.ease
      }}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = 'PageTransition';