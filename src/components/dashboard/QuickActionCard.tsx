import { memo } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverAnimation } from '@/components/ui/animated';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  iconBg: string;
  badge?: string;
}

export const QuickActionCard = memo(({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  color = 'text-primary',
  iconBg = 'bg-primary/10',
  badge
}: QuickActionCardProps) => {
  return (
    <HoverAnimation scale={1.03} y={-4}>
      <Link to={to}>
        <Card className="relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl shadow-md border border-border/50 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn("p-2.5 rounded-xl flex-shrink-0 shadow-sm", iconBg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold group-hover:text-amber-600 transition-colors">{title}</h3>
                  {badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                      {badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </div>
          </CardContent>
          {/* Subtle hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
      </Link>
    </HoverAnimation>
  );
});

QuickActionCard.displayName = 'QuickActionCard';
