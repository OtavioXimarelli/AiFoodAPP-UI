import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedElement, HoverAnimation } from '@/components/ui/animated';

interface SimpleFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const SimpleFeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: SimpleFeatureCardProps) => {
  return (
    <AnimatedElement variant="fadeIn" delay={delay}>
      <HoverAnimation scale={1.05}>
        <Card className="border-0 shadow-lg h-full group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </HoverAnimation>
    </AnimatedElement>
  );
});

SimpleFeatureCard.displayName = 'SimpleFeatureCard';
