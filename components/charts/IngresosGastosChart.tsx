"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatARS } from "@/lib/utils/format";

export interface IngresosGastosPoint {
  monthLabel: string;     // "Jun"
  monthKey: string;       // "2026-06"
  ingresos: number;
  gastos: number;
  resultado: number;
}

interface Props {
  data: IngresosGastosPoint[];
}

export function IngresosGastosChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-ingresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(122 39% 49%)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(122 39% 49%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-gastos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(35 60% 55%)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="hsl(35 60% 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="monthLabel"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={60}
          tickFormatter={(v: number) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
          }
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />

        <Tooltip
          cursor={{ stroke: "hsl(var(--border))", strokeDasharray: 4 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const ingresos = payload.find((p) => p.dataKey === "ingresos")?.value as number | undefined;
            const gastos = payload.find((p) => p.dataKey === "gastos")?.value as number | undefined;
            const resultado = (ingresos ?? 0) - (gastos ?? 0);
            return (
              <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-campo-400" />
                      Ingresos
                    </span>
                    <span className="font-mono tabular-nums">{formatARS(ingresos ?? 0, { compact: true })}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Gastos
                    </span>
                    <span className="font-mono tabular-nums">{formatARS(gastos ?? 0, { compact: true })}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-border/40 pt-1.5">
                    <span className="text-muted-foreground">Resultado</span>
                    <span
                      className={`font-mono tabular-nums ${
                        resultado >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatARS(resultado, { compact: true })}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />

        <Area
          type="monotone"
          dataKey="ingresos"
          stroke="hsl(122 39% 49%)"
          strokeWidth={2}
          fill="url(#grad-ingresos)"
          activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(122 39% 49%)" }}
        />
        <Area
          type="monotone"
          dataKey="gastos"
          stroke="hsl(35 60% 55%)"
          strokeWidth={2}
          fill="url(#grad-gastos)"
          activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(35 60% 55%)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
