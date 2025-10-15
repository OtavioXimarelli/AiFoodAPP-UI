import { memo } from 'react';
import { Trophy } from 'lucide-react';
import { AnimatedElement } from '@/components/ui/animated';

interface WelcomeCardProps {
  userName?: string;
  userEmail?: string;
}

export const WelcomeCard = memo(({ userName, userEmail }: WelcomeCardProps) => {
  return (
    <AnimatedElement variant="slideUp">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-2xl shadow-amber-500/30 border border-amber-400/20">
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Bem-vindo, {userName || userEmail} <Trophy className="w-6 h-6" />
            </h1>
            <p className="text-white/90 text-sm">
              Gerencie suas despensas e descubra receitas deliciosas com IA.
            </p>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 opacity-20 blur-2xl -z-10" />
      </div>
    </AnimatedElement>
  );
});

WelcomeCard.displayName = 'WelcomeCard';
