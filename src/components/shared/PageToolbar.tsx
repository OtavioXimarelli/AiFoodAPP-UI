import React from "react";

interface PageToolbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

// Neutral page-level toolbar (no glass); the global app header handles glassmorphism
const PageToolbar: React.FC<PageToolbarProps> = ({ title, subtitle, actions, className }) => {
  return (
    <div className={`w-full px-4 sm:px-6 ${className ?? ""}`}>
      <div className="w-full rounded-2xl bg-card border border-border shadow-sm px-4 py-3 sm:px-6 sm:py-4">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 sm:gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageToolbar;
