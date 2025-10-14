import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface PolicySectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  iconColor?: string;
}

export const PolicySection = memo(({ icon: Icon, title, children, iconColor = 'text-amber-500' }: PolicySectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
});

PolicySection.displayName = 'PolicySection';
