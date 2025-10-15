import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';
import { HoverAnimation } from '@/components/ui/animated';
import { cn } from '@/lib/utils';

interface RecentRecipeCardProps {
  id: string;
  title: string;
  prepTime?: string;
  servings?: number;
  imageUrl?: string;
}

export const RecentRecipeCard = memo(({ 
  id, 
  title, 
  prepTime, 
  servings 
}: RecentRecipeCardProps) => {
  return (
    <Link to={`/dashboard/recipes/${id}`} className="block">
      <HoverAnimation scale={1.02}>
        <Card className="border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-600 transition-colors truncate mb-2">{title}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{prepTime}</span>
                    </div>
                  )}
                  {servings && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{servings} porções</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverAnimation>
    </Link>
  );
});

RecentRecipeCard.displayName = 'RecentRecipeCard';
