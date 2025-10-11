import React, { memo } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedNavLinkProps extends Omit<NavLinkProps, 'className'> {
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  children?:
    | React.ReactNode
    | ((props: { isActive: boolean; isPending: boolean }) => React.ReactNode);
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  showAnimation?: boolean;
}

export const OptimizedNavLink = memo<OptimizedNavLinkProps>(
  ({ icon: Icon, label, showAnimation = true, className, children, ...props }) => {
    return (
      <NavLink
        {...props}
        className={({ isActive, isPending }) => {
          const baseClasses = cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
            'hover:bg-gradient-warm hover:text-foreground group touch-feedback relative overflow-hidden',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
            isActive
              ? 'bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-xl'
              : 'text-muted-foreground hover:text-foreground hover:shadow-soft',
            isPending && 'opacity-50'
          );

          if (typeof className === 'function') {
            return cn(baseClasses, className({ isActive, isPending }));
          }

          return cn(baseClasses, className);
        }}
      >
        {({ isActive, isPending }) => {
          const content = (
            <>
              {Icon && (
                <motion.div
                  whileHover={showAnimation ? { scale: 1.2, rotate: 10 } : undefined}
                  transition={{ type: 'spring', stiffness: 600 }}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                </motion.div>
              )}
              {label && <span className="font-medium">{label}</span>}
              {isActive && showAnimation && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-primary rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </>
          );

          if (typeof children === 'function') {
            return children({ isActive, isPending });
          }

          if (children) {
            return children;
          }

          if (showAnimation) {
            return (
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {content}
              </motion.div>
            );
          }

          return <div className="flex items-center gap-3 w-full">{content}</div>;
        }}
      </NavLink>
    );
  }
);

OptimizedNavLink.displayName = 'OptimizedNavLink';
