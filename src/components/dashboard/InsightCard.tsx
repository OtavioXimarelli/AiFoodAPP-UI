import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/ui/animated';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightItem {
  label: string;
  value: string | number;
  color?: string;
  badge?: string;
}

interface InsightCardProps {
  title: string;
  items: InsightItem[];
  actionLabel?: string;
  onAction?: () => void;
  delay?: number;
}

export const InsightCard = memo(({ 
  title, 
  items, 
  actionLabel, 
  onAction,
  delay = 0 
}: InsightCardProps) => {
  return (
    <AnimatedElement variant="slideUp" delay={delay}>
      <Card className="border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-5">
          <h3 className="font-bold text-base mb-4 text-foreground">{title}</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-muted-foreground truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className={cn('text-xs shadow-sm', item.color)} variant="outline">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn('font-semibold text-sm', item.color || 'text-foreground')}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          {actionLabel && onAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              onClick={onAction}
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </AnimatedElement>
  );
});

InsightCard.displayName = 'InsightCard';
