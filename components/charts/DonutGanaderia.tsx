"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { RODEO_MOCK, TOTAL_CABEZAS, type CategoriaInfo } from "@/lib/data/ganaderia";

export function DonutGanaderia() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="relative h-[240px] w-[240px] shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={RODEO_MOCK}
              dataKey="cabezas"
              nameKey="label"
              innerRadius={72}
              outerRadius={112}
              paddingAngle={3}
              strokeWidth={0}
            >
              {RODEO_MOCK.map((entry) => (
                <Cell key={entry.categoria} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as CategoriaInfo;
                const pct = (p.cabezas / TOTAL_CABEZAS) * 100;
                return (
                  <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
                    <p className="font-semibold">{p.label}</p>
                    <p className="font-mono tabular-nums">{p.cabezas} cab. · {pct.toFixed(0)}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Rodeo</span>
          <span className="mt-0.5 font-mono text-3xl font-bold tabular-nums">{TOTAL_CABEZAS}</span>
          <span className="text-[10px] text-muted-foreground">cabezas</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2.5 self-center">
        {RODEO_MOCK.map((c) => {
          const pct = (c.cabezas / TOTAL_CABEZAS) * 100;
          return (
            <li key={c.categoria} className="rounded-lg border border-border/40 bg-muted/20 p-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: c.color }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.label}</p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-semibold tabular-nums">{c.cabezas}</span>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
