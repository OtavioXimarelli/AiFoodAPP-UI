import { memo } from 'react';
import { motion } from 'framer-motion';
import { AnimatedElement } from '@/components/ui/animated';
import { Lightbulb, TrendingUp, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickTip {
  icon: 'lightbulb' | 'trending' | 'clock' | 'star';
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const iconMap = {
  lightbulb: Lightbulb,
  trending: TrendingUp,
  clock: Clock,
  star: Star,
};

interface QuickTipsCardProps {
  tips: QuickTip[];
  delay?: number;
}

export const QuickTipsCard = memo(({ tips, delay = 0 }: QuickTipsCardProps) => {
  if (tips.length === 0) return null;

  return (
    <AnimatedElement variant="slideUp" delay={delay}>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative gradient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-lg font-bold text-foreground mb-4 relative z-10 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Dicas Rápidas
        </h3>

        <div className="space-y-3 relative z-10">
          {tips.map((tip, index) => {
            const Icon = iconMap[tip.icon];
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/30 hover:border-border/60 transition-all duration-200">
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    tip.bgColor
                  )}>
                    <Icon className={cn('w-5 h-5', tip.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedElement>
  );
});

QuickTipsCard.displayName = 'QuickTipsCard';
