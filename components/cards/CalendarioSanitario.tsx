"use client";

import { Syringe } from "lucide-react";
import { CALENDARIO_SANITARIO_MOCK } from "@/lib/data/ganaderia";
import { Badge } from "@/components/ui/badge";
import { formatDateAR, formatRelativeAR } from "@/lib/utils/dates";

export function CalendarioSanitario() {
  return (
    <ul className="space-y-2">
      {CALENDARIO_SANITARIO_MOCK.map((v, i) => {
        const dias = Math.floor((v.fecha.getTime() - Date.now()) / 86_400_000);
        const urgencia: "warning" | "success" | "outline" =
          dias <= 14 ? "warning" : dias <= 30 ? "success" : "outline";
        return (
          <li
            key={i}
            className="group flex items-center gap-3 rounded-lg border border-border/40 bg-card/30 p-3 transition-colors hover:bg-card/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
              <Syringe className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium">{v.vacuna}</p>
                <Badge variant={urgencia} className="shrink-0 text-[10px]">
                  {formatRelativeAR(v.fecha)}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {v.categoria} · {v.cabezas} cabezas
              </p>
              {v.notas && (
                <p className="mt-0.5 truncate text-[10px] italic text-muted-foreground/70">
                  {v.notas}
                </p>
              )}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {formatDateAR(v.fecha)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
