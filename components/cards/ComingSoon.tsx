import { Construction, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Construction }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 12px)",
        }}
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/60">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
