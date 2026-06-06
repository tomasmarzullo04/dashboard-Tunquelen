"use client";

import { EVENTOS_RECIENTES_MOCK, EVENTO_META } from "@/lib/data/ganaderia";
import { cn } from "@/lib/utils";
import { formatDateAR, formatRelativeAR } from "@/lib/utils/dates";

export function EventosRodeo() {
  return (
    <ol className="relative space-y-3">
      <span
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-border/60 via-border/30 to-transparent"
      />
      {EVENTOS_RECIENTES_MOCK.map((e, i) => {
        const meta = EVENTO_META[e.tipo];
        return (
          <li key={i} className="relative flex gap-4">
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-xs font-semibold tabular-nums shadow-sm",
                meta.color
              )}
            >
              {e.cantidad}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm leading-tight">{e.detalle}</p>
                <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatRelativeAR(e.fecha)}
                </p>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className={cn("text-[10px] font-medium uppercase tracking-wider", meta.color)}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatDateAR(e.fecha)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
