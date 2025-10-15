import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedElement } from '@/components/ui/animated';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortcutItem {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  bgColor: string;
}

interface ShortcutsGridProps {
  shortcuts: ShortcutItem[];
  delay?: number;
}

export const ShortcutsGrid = memo(({ shortcuts, delay = 0 }: ShortcutsGridProps) => {
  return (
    <div className="space-y-3">
      {shortcuts.map((shortcut, index) => {
        const Icon = shortcut.icon;
        return (
          <AnimatedElement 
            key={shortcut.to} 
            variant="fadeIn" 
            delay={delay + (index * 0.1)}
          >
            <Link to={shortcut.to} className="block">
              <Card className="border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110',
                      shortcut.bgColor
                    )}>
                      <Icon className={cn('w-6 h-6', shortcut.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-0.5">
                        {shortcut.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {shortcut.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </AnimatedElement>
        );
      })}
    </div>
  );
});

ShortcutsGrid.displayName = 'ShortcutsGrid';
