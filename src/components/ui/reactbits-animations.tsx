import React, { forwardRef, ReactNode } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// React Spring animated components
export const SpringCard = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    delay?: number;
    hover?: boolean;
  }
>(({ children, className, delay = 0, hover = true }, ref) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(20px)',
    config: config.gentle,
    delay,
  });

  const [hoverProps, setHover] = useSpring(() => ({
    transform: 'scale(1)',
    config: config.wobbly,
  }));

  return (
    <animated.div
      ref={(node) => {
        inViewRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      style={springProps}
      className={cn('cursor-pointer', className)}
      onMouseEnter={hover ? () => setHover({ transform: 'scale(1.02)' }) : undefined}
      onMouseLeave={hover ? () => setHover({ transform: 'scale(1)' }) : undefined}
    >
      <animated.div style={hover ? hoverProps : undefined}>
        {children}
      </animated.div>
    </animated.div>
  );
});

SpringCard.displayName = 'SpringCard';

// Floating Action Button with physics
export const FloatingButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  }
>(({ children, className, onClick, position = 'bottom-right' }, ref) => {
  const [springProps, setSpring] = useSpring(() => ({
    transform: 'scale(1) rotate(0deg)',
    config: config.wobbly,
  }));

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <animated.button
      ref={ref}
      style={springProps}
      className={cn(
        'z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-shadow',
        positionClasses[position],
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setSpring({ transform: 'scale(1.1) rotate(5deg)' })}
      onMouseLeave={() => setSpring({ transform: 'scale(1) rotate(0deg)' })}
      onMouseDown={() => setSpring({ transform: 'scale(0.95) rotate(-5deg)' })}
      onMouseUp={() => setSpring({ transform: 'scale(1.1) rotate(5deg)' })}
    >
      {children}
    </animated.button>
  );
});

FloatingButton.displayName = 'FloatingButton';

// Parallax container
export const ParallaxContainer = ({ 
  children, 
  speed = 0.5, 
  className 
}: { 
  children: ReactNode; 
  speed?: number; 
  className?: string; 
}) => {
  const [{ y }, set] = useSpring(() => ({ y: 0 }));

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      set({ y: scrollY * speed });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, set]);

  return (
    <animated.div
      style={{ transform: y.to(y => `translateY(${y}px)`) }}
      className={className}
    >
      {children}
    </animated.div>
  );
};

// Staggered list animation
export const StaggeredList = ({ 
  children, 
  stagger = 100,
  className 
}: { 
  children: ReactNode[]; 
  stagger?: number;
  className?: string;
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const springs = useSpring({
    opacity: inView ? 1 : 0,
    config: config.gentle,
  });

  return (
    <animated.div ref={inViewRef} style={springs} className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * (stagger / 1000), duration: 0.5 }}
          key={index}
        >
          {child}
        </motion.div>
      ))}
    </animated.div>
  );
};

// Magnetic button effect
export const MagneticButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
  }
>(({ children, className, onClick, strength = 0.3 }, ref) => {
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (event.clientX - centerX) * strength;
    const distanceY = (event.clientY - centerY) * strength;
    
    set({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    set({ x: 0, y: 0 });
  };

  return (
    <animated.button
      ref={ref}
      style={{ transform: `translate3d(${x.get()}px, ${y.get()}px, 0)` }}
      className={cn('transition-colors', className)}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <animated.div style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>
        {children}
      </animated.div>
    </animated.button>
  );
});

MagneticButton.displayName = 'MagneticButton';

// Morphing shape
export const MorphingShape = ({ 
  className,
  shapes = ['circle', 'square', 'triangle'],
  duration = 2000 
}: { 
  className?: string;
  shapes?: string[];
  duration?: number;
}) => {
  const [shapeIndex, setShapeIndex] = React.useState(0);

  const springProps = useSpring({
    borderRadius: shapeIndex === 0 ? '50%' : shapeIndex === 1 ? '10%' : '0%',
    transform: `rotate(${shapeIndex * 120}deg)`,
    config: config.slow,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    }, duration);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return (
    <animated.div
      style={springProps}
      className={cn('w-20 h-20 bg-primary', className)}
    />
  );
};

// Reveal animation
export const RevealAnimation = ({ 
  children, 
  direction = 'up',
  className 
}: { 
  children: ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      case 'left': return 'translateX(50px)';
      case 'right': return 'translateX(-50px)';
      default: return 'translateY(50px)';
    }
  };

  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translate(0px, 0px)' : getInitialTransform(),
    config: config.gentle,
  });

  return (
    <animated.div ref={inViewRef} style={springProps} className={className}>
      {children}
    </animated.div>
  );
};