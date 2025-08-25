import * as React from "react"
import { cn } from "@/lib/utils"
import { EnhancedClickSpark } from "./enhanced-click-spark"

export interface ClickableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  enableClickSpark?: boolean;
  sparkColor?: string;
  sparkCount?: number;
}

const ClickableCard = React.forwardRef<HTMLDivElement, ClickableCardProps>(
  ({ className, enableClickSpark = false, sparkColor, sparkCount, children, ...props }, ref) => {
    const cardElement = (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
          enableClickSpark && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (enableClickSpark) {
      return (
        <EnhancedClickSpark 
          sparkColor={sparkColor}
          sparkCount={sparkCount}
          className="w-full h-full"
        >
          {cardElement}
        </EnhancedClickSpark>
      );
    }

    return cardElement;
  }
);

ClickableCard.displayName = "ClickableCard";

export { ClickableCard };
