import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedAnimation, usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const EnhancedClickSpark = lazy(() => import('@/components/ui/enhanced-click-spark').then(module => ({ default: module.EnhancedClickSpark })));
const SpotlightCard = lazy(() => import('@/components/ui/spotlight-card').then(module => ({ default: module.SpotlightCard })));

// Optimized skeleton for loading states
export const OptimizedSkeleton = memo(() => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
));

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

// Optimized stat card component
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  index: number;
}

export const OptimizedStatCard = memo<StatCardProps>(({ label, value, icon: Icon, color, index }) => {
  const { animationConfig, shouldReduceMotion } = useOptimizedAnimation();
  const { measureRender } = usePerformance('StatCard');

  const animationProps = useMemo(() => {
    if (shouldReduceMotion) {
      return {};
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { 
        delay: index * 0.1,
        duration: animationConfig.duration,
        ease: "easeOut" as const
      }
    };
  }, [shouldReduceMotion, animationConfig, index]);

  return (
    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
      <motion.div {...animationProps}>
        <EnhancedClickSpark>
          <SpotlightCard className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-2">
              <Icon className={cn('h-4 w-4', color)} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </SpotlightCard>
        </EnhancedClickSpark>
      </motion.div>
    </Suspense>
  );
});

OptimizedStatCard.displayName = 'OptimizedStatCard';

// Optimized action card component
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  index: number;
}

export const OptimizedActionCard = memo<ActionCardProps>(({ title, description, icon: Icon, href, color, index }) => {
  const { animationConfig, shouldReduceMotion } = useOptimizedAnimation();

  const animationProps = useMemo(() => {
    if (shouldReduceMotion) {
      return {};
    }
    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      whileHover: { scale: 1.02 },
      transition: { 
        delay: index * 0.15,
        duration: animationConfig.duration,
        ease: "easeOut" as const
      }
    };
  }, [shouldReduceMotion, animationConfig, index]);

  return (
    <Suspense fallback={<Skeleton className="h-32 w-full" />}>
      <motion.div {...animationProps}>
        <EnhancedClickSpark>
          <a href={href} className="block">
            <SpotlightCard className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className={cn('rounded-lg bg-gradient-to-br p-2', color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <CardTitle className="text-sm font-medium">
                    {title}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </CardHeader>
            </SpotlightCard>
          </a>
        </EnhancedClickSpark>
      </motion.div>
    </Suspense>
  );
});

OptimizedActionCard.displayName = 'OptimizedActionCard';

// Optimized activity item component
interface ActivityItemProps {
  title: string;
  description: string;
  badge: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: 'secondary' | 'outline';
  };
  index: number;
}

export const OptimizedActivityItem = memo<ActivityItemProps>(({ title, description, badge, index }) => {
  const { animationConfig, shouldReduceMotion } = useOptimizedAnimation();

  const animationProps = useMemo(() => {
    if (shouldReduceMotion) {
      return {};
    }
    return {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { 
        delay: index * 0.1,
        duration: animationConfig.duration,
        ease: "easeOut" as const
      }
    };
  }, [shouldReduceMotion, animationConfig, index]);

  return (
    <Suspense fallback={<Skeleton className="h-20 w-full" />}>
      <motion.div {...animationProps}>
        <EnhancedClickSpark>
          <SpotlightCard className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
                <Badge variant={badge.variant}>
                  <badge.icon className="mr-1 h-3 w-3" />
                  {badge.text}
                </Badge>
              </div>
            </CardHeader>
          </SpotlightCard>
        </EnhancedClickSpark>
      </motion.div>
    </Suspense>
  );
});

OptimizedActivityItem.displayName = 'OptimizedActivityItem';

// Performance optimization wrapper
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const OptimizedComponent = memo((props: P) => {
    const { metrics, reportPerformanceIssue } = usePerformance(componentName);
    
    // Monitor performance and report issues
    React.useEffect(() => {
      if (metrics.renderTime > 16) { // 60fps threshold
        reportPerformanceIssue(
          `Render time exceeded 16ms: ${metrics.renderTime.toFixed(2)}ms`,
          'medium'
        );
      }
      
      if (metrics.memoryUsage && metrics.memoryUsage > 50) { // 50MB threshold
        reportPerformanceIssue(
          `Memory usage high: ${metrics.memoryUsage.toFixed(2)}MB`,
          'high'
        );
      }
    }, [metrics, reportPerformanceIssue]);

    return <Component {...props} />;
  });

  OptimizedComponent.displayName = `withPerformanceOptimization(${componentName})`;
  return OptimizedComponent;
};

// Virtualized list for large data sets
export const VirtualizedList = memo<{
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  maxHeight: number;
}>(({ items, renderItem, itemHeight, maxHeight }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const [endIndex, setEndIndex] = React.useState(Math.min(items.length, Math.ceil(maxHeight / itemHeight)));

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(maxHeight / itemHeight);
    
    setStartIndex(newStartIndex);
    setEndIndex(Math.min(items.length, newStartIndex + visibleCount + 2)); // +2 for buffer
  }, [itemHeight, maxHeight, items.length]);

  return (
    <div 
      style={{ height: maxHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
      className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';