"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  delta?: number | null;       // porcentaje vs período anterior
  deltaLabel?: string;          // "vs mes anterior"
  icon?: LucideIcon;
  accent?: "primary" | "trigo" | "info" | "danger";
  loading?: boolean;
  inverse?: boolean;            // true si "menos es mejor" (ej. gastos)
}

const accentMap = {
  primary: "from-campo-500/20 to-campo-700/0 text-campo-400",
  trigo: "from-amber-500/20 to-amber-700/0 text-amber-400",
  info: "from-sky-500/20 to-sky-700/0 text-sky-400",
  danger: "from-red-500/20 to-red-700/0 text-red-400",
};

export function KpiCard({
  label,
  value,
  hint,
  delta,
  deltaLabel = "vs mes anterior",
  icon: Icon,
  accent = "primary",
  loading,
  inverse,
}: KpiCardProps) {
  const isPositive = delta != null && delta > 0;
  const isNegative = delta != null && delta < 0;
  const good = inverse ? isNegative : isPositive;
  const bad = inverse ? isPositive : isNegative;

  return (
    <Card className="card-hover relative overflow-hidden p-5 animate-fade-in">
      {/* Glow accent */}
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br opacity-50 blur-2xl",
          accentMap[accent]
        )}
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-32 animate-pulse rounded bg-muted/60" />
          ) : (
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight">
              {value}
            </p>
          )}
          {hint && !loading && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-lg bg-muted/40 p-2 backdrop-blur", `text-${accent === "primary" ? "campo-400" : ""}`)}>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {!loading && delta != null && (
        <div className="relative mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono font-medium tabular-nums",
              good && "bg-emerald-500/15 text-emerald-400",
              bad && "bg-red-500/15 text-red-400",
              delta === 0 && "bg-muted text-muted-foreground"
            )}
          >
            {delta > 0 && <ArrowUpRight className="h-3 w-3" />}
            {delta < 0 && <ArrowDownRight className="h-3 w-3" />}
            {delta === 0 && <Minus className="h-3 w-3" />}
            {delta > 0 ? "+" : ""}
            {delta.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%
          </span>
          <span className="text-muted-foreground">{deltaLabel}</span>
        </div>
      )}
    </Card>
  );
}
