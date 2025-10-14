import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { AnimatedElement } from '@/components/ui/animated';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
}

export const PageHeader = memo(({ 
  icon: Icon, 
  title, 
  subtitle, 
  backTo = '/', 
  backLabel = 'Voltar para Home' 
}: PageHeaderProps) => {
  return (
    <AnimatedElement variant="slideUp">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </AnimatedElement>
  );
});

PageHeader.displayName = 'PageHeader';
