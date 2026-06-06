import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0–100
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, indicatorClassName, ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted/60", className)}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500",
            indicatorClassName
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
