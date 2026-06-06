"use client";

import { LOTES, ESTADO_META, cultivoTint, TOTAL_HECTAREAS } from "@/lib/data/lotes";
import { cn } from "@/lib/utils";

/**
 * Plano esquemático de los lotes — no es geográfico, es un layout estilizado.
 * Cada lote se renderiza como una "parcela" coloreada según el cultivo de la campaña.
 */
export function LotesMapMini() {
  return (
    <div className="space-y-3">
      <div
        className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-2"
        role="img"
        aria-label="Plano esquemático de lotes de Tunquelen"
      >
        {/* Sutil patrón de surcos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 14px)",
          }}
        />

        <div
          className="relative grid h-full w-full gap-1.5"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {LOTES.map((lote) => {
            const meta = ESTADO_META[lote.estado];
            return (
              <div
                key={lote.id}
                className={cn(
                  "group relative flex flex-col justify-between rounded-lg border border-border/40 bg-gradient-to-br p-2.5 transition-all hover:scale-[1.02] hover:border-border hover:shadow-lg",
                  cultivoTint(lote.cultivoActual)
                )}
                style={{
                  gridColumn: `${lote.grid.col} / span ${lote.grid.colSpan}`,
                  gridRow: `${lote.grid.row} / span ${lote.grid.rowSpan}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold leading-tight">{lote.nombre}</p>
                  <span
                    className={cn("h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_6px]", meta.dot)}
                    title={meta.label}
                  />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {lote.hectareas} ha
                  </p>
                  <p className="text-[10px] font-medium text-foreground/80">
                    {lote.cultivoActual}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marca de orientación */}
        <div className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-1 font-mono text-[9px] text-muted-foreground/60">
          <span>N</span>
          <span className="inline-block h-2 w-px bg-current" />
        </div>
      </div>

      {/* Leyenda compacta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground">
        <span className="font-mono tabular-nums">Total {TOTAL_HECTAREAS} ha</span>
        <span className="opacity-40">·</span>
        {Object.entries(ESTADO_META)
          .filter(([key]) => LOTES.some((l) => l.estado === key))
          .map(([key, meta]) => (
            <span key={key} className="inline-flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          ))}
      </div>
    </div>
  );
}
