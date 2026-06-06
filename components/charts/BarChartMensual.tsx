"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatARS } from "@/lib/utils/format";

interface Props {
  data: { monthLabel: string; ingresos: number; gastos: number }[];
}

export function BarChartMensual({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }} barGap={4}>
        <defs>
          <linearGradient id="bar-ing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(122 39% 49%)" stopOpacity={1} />
            <stop offset="100%" stopColor="hsl(122 60% 24%)" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="bar-gas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(35 60% 55%)" stopOpacity={1} />
            <stop offset="100%" stopColor="hsl(35 60% 30%)" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} dy={6} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickFormatter={(v: number) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
          }
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const ingresos = payload.find((p) => p.dataKey === "ingresos")?.value as number | undefined;
            const gastos = payload.find((p) => p.dataKey === "gastos")?.value as number | undefined;
            return (
              <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-campo-400" />
                      Ingresos
                    </span>
                    <span className="font-mono tabular-nums">{formatARS(ingresos ?? 0, { compact: true })}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-amber-400" />
                      Gastos
                    </span>
                    <span className="font-mono tabular-nums">{formatARS(gastos ?? 0, { compact: true })}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="ingresos" fill="url(#bar-ing)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="gastos" fill="url(#bar-gas)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
