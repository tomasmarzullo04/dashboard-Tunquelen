"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/utils/format";
import type { InsumoAplicado } from "@/lib/data/labores-stats";

interface Props {
  data: InsumoAplicado[];
}

export function InsumosBarChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        Sin productos detectados.
      </div>
    );
  }
  const formatted = data.map((d) => ({
    label: d.producto.length > 22 ? d.producto.slice(0, 20) + "…" : d.producto,
    cantidad: d.cantidad,
    unidad: d.unidad,
    ocurrencias: d.ocurrencias,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
      <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="insumo-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(122 60% 35%)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="hsl(122 39% 49%)" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickFormatter={(v: number) => formatNumber(v, 0)}
        />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={140}
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload as typeof formatted[number];
            return (
              <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                <p className="font-semibold capitalize">{p.label}</p>
                <p className="font-mono tabular-nums">
                  {formatNumber(p.cantidad, p.cantidad % 1 === 0 ? 0 : 1)} {p.unidad}
                </p>
                <p className="text-muted-foreground">
                  Aplicado en {p.ocurrencias} {p.ocurrencias === 1 ? "labor" : "labores"}
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="cantidad" fill="url(#insumo-grad)" radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
