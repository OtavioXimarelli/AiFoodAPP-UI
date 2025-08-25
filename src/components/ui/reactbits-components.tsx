import React from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

// Enhanced card with multiple animation effects
export const ReactBitsCard = ({ 
  children, 
  className,
  variant = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: 'default' | 'hover-glow' | 'tilt' | 'magnetic';
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== 'tilt' && variant !== 'magnetic') return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = cn(
    'rounded-xl border bg-card text-card-foreground shadow transition-all duration-300',
    {
      'hover:shadow-xl hover:shadow-primary/20': variant === 'hover-glow',
      'hover:shadow-2xl': variant === 'magnetic',
    },
    className
  );

  if (variant === 'tilt') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        style={{ x, y, rotateX, rotateY, z: 100 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      onMouseMove={variant === 'magnetic' ? handleMouseMove : undefined}
      onMouseLeave={variant === 'magnetic' ? handleMouseLeave : undefined}
      className={baseClasses}
      whileHover={{ scale: variant === 'default' ? 1.02 : 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Particle system background
export const ParticleBackground = ({ 
  particleCount = 50,
  className 
}: { 
  particleCount?: number;
  className?: string;
}) => {
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Text reveal animation
export const TextReveal = ({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <motion.div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: delay + index * 0.1, 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Scroll-triggered animations
export const ScrollTriggeredSection = ({ 
  children, 
  className,
  animation = 'fadeUp'
}: { 
  children: React.ReactNode; 
  className?: string;
  animation?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    rotate: {
      initial: { opacity: 0, rotate: -180 },
      animate: { opacity: 1, rotate: 0 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={animations[animation].initial}
      animate={inView ? animations[animation].animate : animations[animation].initial}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Interactive button with ripple effect
export const RippleButton = ({ 
  children, 
  onClick,
  className,
  variant = 'default'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}) => {
  const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  const variantClasses = {
    default: 'bg-background text-foreground border-border hover:bg-muted',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-colors border',
        variantClasses[variant],
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
};

// Loading skeleton with shimmer effect
export const ShimmerSkeleton = ({ 
  className,
  lines = 3,
  avatar = false
}: { 
  className?: string;
  lines?: number;
  avatar?: boolean;
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="w-12 h-12 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-full animate-shimmer" />
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                'h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded animate-shimmer',
                i === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Glitch text effect
export const GlitchText = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover="hover"
    >
      <motion.span
        variants={{
          hover: {
            x: [0, -2, 2, 0],
            transition: { duration: 0.3 }
          }
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-red-500"
        variants={{
          hover: {
            x: [0, 2, -2, 0],
            opacity: [0, 0.7, 0.7, 0],
            transition: { duration: 0.3 }
          }
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-blue-500"
        variants={{
          hover: {
            x: [0, -1, 1, 0],
            opacity: [0, 0.5, 0.5, 0],
            transition: { duration: 0.3, delay: 0.1 }
          }
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};