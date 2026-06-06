"use client";

import { useMemo } from "react";
import { format, getDay, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { HeatmapCell } from "@/lib/data/labores-stats";

interface Props {
  cells: HeatmapCell[];
}

/**
 * Heatmap estilo GitHub contributions. Cuadrícula de 7 filas (dom→sáb) × N columnas (semanas).
 */
export function LaboresHeatmap({ cells }: Props) {
  const { weeks, months, maxCount } = useMemo(() => {
    if (cells.length === 0) return { weeks: [] as (HeatmapCell | null)[][], months: [] as { label: string; col: number }[], maxCount: 0 };

    // Alinear la primera celda a domingo del bloque
    const first = cells[0].date;
    const padStart = getDay(startOfWeek(first, { weekStartsOn: 0 })) === getDay(first) ? 0 : getDay(first);

    const padded: (HeatmapCell | null)[] = [];
    for (let i = 0; i < padStart; i++) padded.push(null);
    padded.push(...cells);

    const weeks: (HeatmapCell | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    const months: { label: string; col: number }[] = [];
    let prevMonth = "";
    weeks.forEach((w, col) => {
      const firstReal = w.find((c) => c);
      if (firstReal) {
        const m = format(firstReal.date, "LLL", { locale: es });
        if (m !== prevMonth) {
          months.push({ label: m.replace(".", ""), col });
          prevMonth = m;
        }
      }
    });

    const maxCount = Math.max(1, ...cells.map((c) => c.count));
    return { weeks, months, maxCount };
  }, [cells]);

  function levelClass(count: number): string {
    if (count === 0) return "bg-muted/30 border border-border/30";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-campo-700/60 border border-campo-700/70";
    if (ratio <= 0.5)  return "bg-campo-600/80 border border-campo-600";
    if (ratio <= 0.75) return "bg-campo-500   border border-campo-500";
    return "bg-campo-400 border border-campo-300 shadow-[0_0_8px_hsl(122_60%_50%/0.5)]";
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Labels de meses */}
          <div className="relative h-3 ml-7">
            {months.map((m, i) => (
              <span
                key={i}
                className="absolute text-[10px] uppercase tracking-wider text-muted-foreground"
                style={{ left: m.col * 12 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-1">
            {/* Labels días (lun/mié/vie) */}
            <div className="flex flex-col gap-[2px] pr-1 pt-0">
              {["dom", "lun", "mar", "mié", "jue", "vie", "sáb"].map((d, i) => (
                <span
                  key={d}
                  className="h-[10px] text-[8px] leading-[10px] text-muted-foreground"
                  style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((cell, di) => {
                    if (!cell) {
                      return <span key={di} className="block h-[10px] w-[10px]" />;
                    }
                    return (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <span
                            className={cn(
                              "block h-[10px] w-[10px] rounded-[2px] transition-transform hover:scale-150",
                              levelClass(cell.count)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">
                            {cell.count} {cell.count === 1 ? "labor" : "labores"}
                          </p>
                          <p className="text-muted-foreground">
                            {format(cell.date, "EEEE d 'de' MMM yyyy", { locale: es })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Leyenda */}
          <div className="ml-7 mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Menos</span>
            <div className="flex gap-[2px]">
              {[0, 0.2, 0.5, 0.8, 1].map((r) => (
                <span
                  key={r}
                  className={cn("block h-[10px] w-[10px] rounded-[2px]", levelClass(Math.ceil(r * maxCount)))}
                />
              ))}
            </div>
            <span>Más</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
