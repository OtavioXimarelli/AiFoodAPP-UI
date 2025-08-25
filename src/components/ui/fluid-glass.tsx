import React from 'react';
import { cn } from '@/lib/utils';

interface FluidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong';
  intensity?: 'low' | 'medium' | 'high';
}

export const FluidGlass: React.FC<FluidGlassProps> = ({ 
  children, 
  className,
  variant = 'default',
  intensity = 'medium'
}) => {
  const variants = {
    default: 'backdrop-blur-md bg-white/10 border border-white/20',
    subtle: 'backdrop-blur-sm bg-white/5 border border-white/10',
    strong: 'backdrop-blur-xl bg-white/20 border border-white/30'
  };

  const intensityClasses = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl'
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl',
        variants[variant],
        intensityClasses[intensity],
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-50',
        'dark:bg-black/10 dark:border-white/10',
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Fluid Glass Card variant
export const FluidGlassCard: React.FC<FluidGlassProps & {
  title?: string;
  description?: string;
}> = ({ 
  children, 
  title, 
  description,
  className,
  variant = 'default',
  intensity = 'medium'
}) => {
  return (
    <FluidGlass 
      variant={variant} 
      intensity={intensity}
      className={cn('p-6', className)}
    >
      {title && (
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
      )}
      {children}
    </FluidGlass>
  );
};

// Animated Fluid Glass with hover effects
export const AnimatedFluidGlass: React.FC<FluidGlassProps> = ({ 
  children, 
  className,
  variant = 'default',
  intensity = 'medium'
}) => {
  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-2xl',
        className
      )}
    >
      <FluidGlass 
        variant={variant} 
        intensity={intensity}
        className={cn(
          'transition-all duration-300',
          'group-hover:backdrop-blur-xl group-hover:bg-white/20',
          'dark:group-hover:bg-black/20'
        )}
      >
        {children}
      </FluidGlass>
    </div>
  );
};