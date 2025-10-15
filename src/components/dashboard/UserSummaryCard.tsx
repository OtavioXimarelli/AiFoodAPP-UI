import { memo } from 'react';
import { AnimatedElement } from '@/components/ui/animated';

interface UserSummaryCardProps {
  userName?: string;
}

export const UserSummaryCard = memo(({
  userName,
}: UserSummaryCardProps) => {
  // Extract first name, handling cases where email might be in name field
  const getFirstName = (name?: string): string => {
    if (!name) return 'Chef';
    
    // If it's an email, extract the part before @
    if (name.includes('@')) {
      const emailPart = name.split('@')[0];
      // Capitalize first letter of email username
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
    }
    
    // Otherwise, get first word (first name)
    return name.split(' ')[0];
  };
  
  const firstName = getFirstName(userName);

  return (
    <AnimatedElement variant="slideUp" delay={0}>
      <div className="border border-border/50 bg-gradient-to-br from-card via-card to-card/95 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden rounded-2xl p-6">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <span className="text-3xl font-bold text-white">
              {firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Olá, {firstName}! 👋
            </h2>
            <p className="text-muted-foreground">
              Bem-vindo de volta ao seu painel
            </p>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
});

UserSummaryCard.displayName = 'UserSummaryCard';

