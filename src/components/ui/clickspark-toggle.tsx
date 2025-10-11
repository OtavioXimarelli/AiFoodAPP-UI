import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useClickSpark } from '@/components/ClickSparkProvider';

interface ClickSparkToggleProps {
  className?: string;
}

export const ClickSparkToggle: React.FC<ClickSparkToggleProps> = ({ className }) => {
  const { isGlobalClickSparkEnabled, toggleGlobalClickSpark } = useClickSpark();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Sparkles
        className={`h-4 w-4 ${isGlobalClickSparkEnabled ? 'text-primary' : 'text-muted-foreground'}`}
      />
      <Label htmlFor="clickspark-toggle" className="text-sm font-medium">
        Efeitos de clique
      </Label>
      <Switch
        id="clickspark-toggle"
        checked={isGlobalClickSparkEnabled}
        onCheckedChange={toggleGlobalClickSpark}
      />
    </div>
  );
};

export default ClickSparkToggle;
