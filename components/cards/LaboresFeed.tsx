"use client";

import { Tractor, Sprout } from "lucide-react";
import { formatDateAR } from "@/lib/utils/dates";

export interface LaborFeedEntry {
  fecha: Date | null;
  hora: string;
  loteOCultivo: string;
  insumosResumen: string;
  observaciones: string;
}

interface Props {
  items: LaborFeedEntry[];
}

export function LaboresFeed({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 p-8 text-center">
        <Tractor className="h-6 w-6 text-muted-foreground/60" />
        <p className="text-sm text-muted-foreground">Aún no hay labores registradas.</p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-4">
      {/* Línea vertical del timeline */}
      <span
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-border/60 via-border/30 to-transparent"
      />
      {items.map((l, idx) => (
        <li key={idx} className="relative flex gap-4 pl-0">
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card shadow-sm">
            <Sprout className="h-3.5 w-3.5 text-campo-400" />
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium leading-tight">
                {l.loteOCultivo || "Sin lote"}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatDateAR(l.fecha)}
                {l.hora ? ` · ${l.hora}` : ""}
              </p>
            </div>
            {l.insumosResumen && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {l.insumosResumen}
              </p>
            )}
            {l.observaciones && (
              <p className="mt-1 text-[11px] italic text-muted-foreground/70 line-clamp-1">
                “{l.observaciones}”
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
