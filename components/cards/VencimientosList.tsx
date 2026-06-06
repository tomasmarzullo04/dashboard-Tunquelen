"use client";

import { CalendarClock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatARS } from "@/lib/utils/format";
import { formatDateAR, formatRelativeAR } from "@/lib/utils/dates";

export interface VencimientoItem {
  proveedor: string;
  numero: string;
  fechaVencimiento: Date | null;
  total: number;
  moneda: string;
  diasRestantes: number;
}

interface Props {
  items: VencimientoItem[];
}

function urgencyVariant(dias: number): {
  variant: "danger" | "warning" | "success";
  label: string;
} {
  if (dias <= 7) return { variant: "danger", label: "Urgente" };
  if (dias <= 15) return { variant: "warning", label: "Próximo" };
  return { variant: "success", label: "Programado" };
}

export function VencimientosList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 p-8 text-center">
        <CalendarClock className="h-6 w-6 text-muted-foreground/60" />
        <p className="text-sm text-muted-foreground">
          No hay vencimientos en los próximos 30 días.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/40">
      {items.map((v, i) => {
        const u = urgencyVariant(v.diasRestantes);
        return (
          <li
            key={`${v.proveedor}-${v.numero}-${i}`}
            className="group flex items-center gap-3 py-3 transition-colors hover:bg-muted/20 -mx-2 px-2 rounded-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{v.proveedor || "—"}</p>
                <Badge variant={u.variant} className="shrink-0">
                  {u.label}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {v.numero || "Sin nº"} · {formatDateAR(v.fechaVencimiento)} ({formatRelativeAR(v.fechaVencimiento)})
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-semibold tabular-nums">
                {v.moneda === "USD" ? "USD " : ""}
                {formatARS(v.total, { compact: v.total >= 1_000_000 })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
