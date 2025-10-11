import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

// ReactBitsCard: simple animated card with optional tilt/magnetic behavior
export const ReactBitsCard = ({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover-glow' | 'tilt' | 'magnetic';
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [20, -20]);
  const rotateY = useTransform(x, [-100, 100], [-20, 20]);

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

  const base = cn(
    'rounded-xl border bg-card text-card-foreground shadow transition-all duration-300',
    className
  );

  if (variant === 'tilt') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        style={{ rotateX, rotateY, z: 0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={base}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      onMouseMove={variant === 'magnetic' ? handleMouseMove : undefined}
      onMouseLeave={variant === 'magnetic' ? handleMouseLeave : undefined}
      className={base}
      whileHover={{ scale: variant === 'default' ? 1.02 : 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// ParticleBackground: enhanced floating particles with varied animations
export const ParticleBackground = ({
  particleCount = 40,
  className,
}: {
  particleCount?: number;
  className?: string;
}) => {
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const animationType = Math.floor(Math.random() * 4); // 4 different animation types
    return {
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 2,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10,
      animationType,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60, // For color variation
    };
  });

  const getAnimation = (particle: any) => {
    const { animationType, duration } = particle;

    switch (animationType) {
      case 0: // Floating movement
        return {
          x: [`0%`, `${(Math.random() - 0.5) * 60}%`, '0%'],
          y: [`0%`, `${(Math.random() - 0.5) * 60}%`, '0%'],
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        };
      case 1: // Circular movement
        return {
          x: [`0%`, `30%`, `0%`, `-30%`, '0%'],
          y: [`0%`, `-30%`, `-60%`, `-30%`, '0%'],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.8, 0.3],
        };
      case 2: // Wave-like movement
        return {
          x: [`0%`, `40%`, `-20%`, `0%`],
          y: [`0%`, `20%`, `40%`, '0%'],
          scale: [0.8, 1.3, 0.8],
          rotate: [0, 90, 180, 270, 360],
        };
      default: // Pulsing movement
        return {
          x: [`0%`, `${(Math.random() - 0.5) * 30}%`, '0%'],
          y: [`0%`, `${(Math.random() - 0.5) * 30}%`, '0%'],
          scale: [0.5, 1.5, 0.5],
          opacity: [0.2, 0.9, 0.2],
        };
    }
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${220 + p.hue}, 70%, 60%)`,
            opacity: p.opacity,
            filter: 'blur(0.5px)',
          }}
          animate={getAnimation(p)}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: p.animationType === 1 ? 'linear' : 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Add some special glowing particles */}
      {Array.from({ length: Math.floor(particleCount / 8) }).map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 12 + 6,
            height: Math.random() * 12 + 6,
            filter: 'blur(2px)',
            boxShadow: '0 0 20px currentColor',
          }}
          animate={{
            x: [`0%`, `${(Math.random() - 0.5) * 80}%`, '0%'],
            y: [`0%`, `${(Math.random() - 0.5) * 80}%`, '0%'],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// TextReveal: supports plain string (word-by-word) or React nodes (simple fade-in)
export const TextReveal = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  if (typeof children === 'string') {
    const words = children.split(' ').filter(Boolean);
    return (
      <motion.div className={className} aria-hidden={false}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.08, duration: 0.45, ease: 'easeOut' }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // JSX children: single fade-in wrapper
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// ScrollTriggeredSection: generic entry animations
export const ScrollTriggeredSection = ({
  children,
  className,
  animation = 'fadeUp',
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });

  const animations: Record<string, any> = {
    fadeUp: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    slideLeft: { initial: { opacity: 0, x: -80 }, animate: { opacity: 1, x: 0 } },
    slideRight: { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
    rotate: { initial: { opacity: 0, rotate: -8 }, animate: { opacity: 1, rotate: 0 } },
  };

  const chosen = animations[animation] || animations.fadeUp;

  return (
    <motion.div
      ref={ref}
      initial={chosen.initial}
      animate={inView ? chosen.animate : chosen.initial}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// RippleButton: button with simple ripple effect
export const RippleButton = ({
  children,
  onClick,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'default' | 'primary' | 'ghost';
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 24; // center offset
    const y = e.clientY - rect.top - 24;
    const id = Date.now();
    setRipples(s => [...s, { id, x, y }]);
    setTimeout(() => setRipples(s => s.filter(r => r.id !== id)), 700);
    if (onClick) onClick(e);
  };

  const variantClasses: Record<string, string> = {
    default: 'bg-primary/10 text-primary border-transparent',
    primary: 'bg-primary text-primary-foreground border-transparent',
    ghost: 'bg-transparent text-primary border',
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden px-4 py-2 rounded-lg font-medium transition-colors',
        variantClasses[variant],
        className
      )}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      {ripples.map(r => (
        <motion.span
          key={r.id}
          className="absolute ripple bg-white/30 rounded-full pointer-events-none w-12 h-12"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </motion.button>
  );
};

// ShimmerSkeleton: loading placeholder
export const ShimmerSkeleton = ({
  className,
  lines = 3,
  avatar = false,
}: {
  className?: string;
  lines?: number;
  avatar?: boolean;
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-4">
        {avatar && <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />}
        <div className="flex-1 space-y-2 py-1">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 bg-muted rounded animate-pulse',
                i === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// GlitchText: lightweight hover glitch
export const GlitchText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div className={cn('relative inline-block', className)} whileHover="hover">
      <motion.span variants={{ hover: { x: [0, -2, 2, 0], transition: { duration: 0.3 } } }}>
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-red-500 mix-blend-screen"
        variants={{
          hover: { x: [0, 2, -2, 0], opacity: [0, 0.7, 0.7, 0], transition: { duration: 0.3 } },
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-blue-500 mix-blend-screen"
        variants={{
          hover: {
            x: [0, -1, 1, 0],
            opacity: [0, 0.5, 0.5, 0],
            transition: { duration: 0.3, delay: 0.05 },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};
