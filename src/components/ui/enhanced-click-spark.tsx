import React, { forwardRef } from 'react';
import ClickSpark from '@/animations/ClickSpark/ClickSpark';
import { cn } from '@/lib/utils';
import { useClickSpark } from '@/components/ClickSparkProvider';

interface EnhancedClickSparkProps {
  children: React.ReactNode;
  className?: string;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  disabled?: boolean;
  respectGlobalSetting?: boolean;
}

export const EnhancedClickSpark = forwardRef<HTMLDivElement, EnhancedClickSparkProps>(
  (
    {
      children,
      className,
      sparkColor = 'hsl(var(--primary))',
      sparkSize = 10,
      sparkRadius = 20,
      sparkCount = 8,
      duration = 400,
      easing = 'ease-out',
      extraScale = 1.0,
      disabled = false,
      respectGlobalSetting = true,
      ...props
    },
    ref
  ) => {
    // Safely get the context - fallback to enabled if context is not available
    let isGlobalClickSparkEnabled = true;
    try {
      const context = useClickSpark?.();
      isGlobalClickSparkEnabled = context?.isGlobalClickSparkEnabled ?? true;
    } catch (error) {
      // Context not available, default to enabled
      isGlobalClickSparkEnabled = true;
    }

    // Check if ClickSpark should be disabled
    const shouldDisable = disabled || (respectGlobalSetting && !isGlobalClickSparkEnabled);

    if (shouldDisable) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full h-full', className)} {...props}>
        <ClickSpark
          sparkColor={sparkColor}
          sparkSize={sparkSize}
          sparkRadius={sparkRadius}
          sparkCount={sparkCount}
          duration={duration}
          easing={easing}
          extraScale={extraScale}
        >
          {children}
        </ClickSpark>
      </div>
    );
  }
);

EnhancedClickSpark.displayName = 'EnhancedClickSpark';

export default EnhancedClickSpark;
