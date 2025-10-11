import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { EnhancedClickSpark } from './enhanced-click-spark';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-300',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-card hover:-translate-y-0.5',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 hover:shadow-soft',
        ghost: 'hover:bg-accent hover:text-accent-foreground transition-all duration-300',
        link: 'text-primary underline-offset-4 hover:underline transition-all duration-300',
        premium:
          'bg-gradient-primary text-primary-foreground hover:shadow-orange hover:-translate-y-1 transition-all duration-300 hover:scale-105',
        modern:
          'bg-gradient-card text-foreground border border-border hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disableClickSpark?: boolean;
  sparkColor?: string;
  sparkCount?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disableClickSpark = false,
      sparkColor,
      sparkCount = 6,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const buttonElement = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );

    if (disableClickSpark || asChild) {
      return buttonElement;
    }

    return (
      <EnhancedClickSpark
        sparkColor={sparkColor}
        sparkCount={sparkCount}
        className="inline-block"
        respectGlobalSetting={true}
      >
        {buttonElement}
      </EnhancedClickSpark>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
