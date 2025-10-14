import { memo } from 'react';
import { LucideIcon, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedElement, HoverAnimation } from '@/components/ui/animated';

interface FeatureDetailCardProps {
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  fullDescription: string;
  gradient: string;
  features: string[];
  delay?: number;
}

export const FeatureDetailCard = memo(({ 
  icon: Icon, 
  title, 
  shortDescription, 
  fullDescription, 
  gradient, 
  features, 
  delay = 0 
}: FeatureDetailCardProps) => {
  return (
    <AnimatedElement variant="slideUp" delay={delay}>
      <HoverAnimation scale={1.02}>
        <Card className="border-0 shadow-xl h-full overflow-hidden">
          <CardHeader className={`bg-gradient-to-br ${gradient} p-8`}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white mb-2">{title}</CardTitle>
                <p className="text-white/90 text-sm">{shortDescription}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {fullDescription}
            </p>
            <div className="space-y-3">
              <Badge variant="outline" className="mb-3 text-xs">
                Recursos Principais
              </Badge>
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverAnimation>
    </AnimatedElement>
  );
});

FeatureDetailCard.displayName = 'FeatureDetailCard';
