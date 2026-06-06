"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatARS, formatNumber } from "@/lib/utils/format";
import type { GranoAgg } from "@/lib/data/financiero";

const COLORS: Record<string, string> = {
  trigo:   "#D4A574",
  maíz:    "#E8B440",
  maiz:    "#E8B440",
  girasol: "#F07A1A",
  soja:    "#86B939",
  cebada:  "#A6824E",
};

const FALLBACK = ["#2E7D32", "#43A047", "#1B5E20", "#0D4011"];

function colorFor(grano: string, idx: number): string {
  const k = grano.toLowerCase();
  return COLORS[k] ?? FALLBACK[idx % FALLBACK.length];
}

interface Props {
  data: GranoAgg[];
}

export function PieGranos({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        Aún no hay liquidaciones cargadas.
      </div>
    );
  }
  const total = data.reduce((s, d) => s + d.monto, 0);

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="monto"
              nameKey="grano"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.grano} fill={colorFor(entry.grano, idx)} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as GranoAgg;
                const pct = total > 0 ? (p.monto / total) * 100 : 0;
                return (
                  <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                    <p className="mb-1 font-semibold">{p.grano}</p>
                    <p className="font-mono tabular-nums">{formatARS(p.monto, { compact: true })}</p>
                    <p className="font-mono tabular-nums text-muted-foreground">
                      {formatNumber(p.volumen, 1)} tn · {pct.toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total cobrado
          </span>
          <span className="mt-0.5 font-mono text-base font-semibold tabular-nums">
            {formatARS(total, { compact: true })}
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-2 self-center">
        {data.map((g, idx) => {
          const pct = total > 0 ? (g.monto / total) * 100 : 0;
          return (
            <li key={g.grano} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: colorFor(g.grano, idx) }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{g.grano}</span>
                  <span className="font-mono tabular-nums">{pct.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums">{formatNumber(g.volumen, 1)} tn</span>
                  <span className="font-mono tabular-nums">{formatARS(g.monto, { compact: true })}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
