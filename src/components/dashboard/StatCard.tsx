import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedElement, HoverAnimation } from '@/components/ui/animated';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  bgColor?: string;
  delay?: number;
}

export const StatCard = memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor = 'bg-muted/50',
  delay = 0 
}: StatCardProps) => {
  return (
    <AnimatedElement variant="slideUp" delay={delay}>
      <HoverAnimation scale={1.03} y={-4}>
        <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={cn("p-2.5 rounded-xl shadow-md", bgColor)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverAnimation>
    </AnimatedElement>
  );
});

StatCard.displayName = 'StatCard';
