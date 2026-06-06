"use client";

import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatARS } from "@/lib/utils/format";
import { formatDateAR } from "@/lib/utils/dates";
import type { ProveedorAgg } from "@/lib/data/financiero";

interface Props {
  data: ProveedorAgg[];
}

export function TopProveedoresList({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Aún no hay facturas registradas.
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.monto));

  return (
    <ul className="space-y-3">
      {data.map((p, idx) => {
        const pct = max > 0 ? (p.monto / max) * 100 : 0;
        return (
          <li key={p.proveedor} className="group">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/40 font-mono text-[10px] font-medium text-muted-foreground">
                #{idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium">{p.proveedor}</p>
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    {formatARS(p.monto, { compact: true })}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress
                    value={pct}
                    className="h-1 flex-1"
                    indicatorClassName={
                      idx === 0
                        ? "bg-gradient-to-r from-campo-500 to-trigo"
                        : "bg-gradient-to-r from-campo-700/80 to-campo-500/80"
                    }
                  />
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {p.cantFacturas} fact.
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Última: {formatDateAR(p.ultimaFactura)}
                </p>
              </div>
              <ChevronRight className="hidden h-3.5 w-3.5 text-muted-foreground/50 group-hover:block" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
