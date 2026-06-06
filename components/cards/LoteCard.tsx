"use client";

import { Calendar, Droplet, Layers, Sprout, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ESTADO_META, cultivoTint } from "@/lib/data/lotes";
import type { LoteDetalle } from "@/lib/data/lotes-detalle";
import { progresoLote } from "@/lib/data/lotes-detalle";
import { formatDateAR, formatRelativeAR } from "@/lib/utils/dates";
import { formatNumber } from "@/lib/utils/format";

interface Props {
  detalle: LoteDetalle;
}

export function LoteCard({ detalle }: Props) {
  const meta = ESTADO_META[detalle.estado];
  const progreso = progresoLote(detalle.estado);
  const top3 = detalle.productosAplicados.slice(0, 3);

  return (
    <Card className="card-hover relative flex flex-col overflow-hidden animate-fade-in">
      {/* Header con tinte por cultivo */}
      <div
        className={cn(
          "relative border-b border-border/40 bg-gradient-to-br p-5",
          cultivoTint(detalle.cultivoActual)
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 12px)",
          }}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight">{detalle.nombre}</h3>
              <span
                className={cn(
                  "inline-flex h-2 w-2 rounded-full shadow-[0_0_8px]",
                  meta.dot
                )}
                title={meta.label}
              />
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
              {detalle.hectareas} ha
            </p>
          </div>
          <Badge variant="outline" className="border-border/60 bg-background/40 text-xs backdrop-blur">
            {meta.label}
          </Badge>
        </div>

        <div className="relative mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-background/40 px-1.5 py-0.5 backdrop-blur">
            {detalle.cultivoAnterior}
          </span>
          <span className="opacity-60">→</span>
          <span className="rounded-md bg-foreground/10 px-1.5 py-0.5 font-medium text-foreground backdrop-blur">
            {detalle.cultivoActual}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Progreso de campaña */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Avance de campaña</span>
            <span className="font-mono tabular-nums text-foreground/80">{progreso}%</span>
          </div>
          <Progress
            value={progreso}
            indicatorClassName="bg-gradient-to-r from-campo-600 via-campo-400 to-trigo"
          />
        </div>

        {/* Última labor */}
        <Metric
          icon={Sprout}
          label="Última labor"
          value={
            detalle.ultimaLabor?.fecha
              ? formatRelativeAR(detalle.ultimaLabor.fecha)
              : "Sin registros"
          }
          hint={
            detalle.ultimaLabor
              ? detalle.ultimaLabor.insumosResumen.slice(0, 60) +
                (detalle.ultimaLabor.insumosResumen.length > 60 ? "…" : "")
              : undefined
          }
        />

        {/* Conteo + productos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3 w-3" />
              Labores
            </div>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
              {detalle.cantidadLabores}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Droplet className="h-3 w-3" />
              Productos
            </div>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
              {detalle.productosAplicados.length}
            </p>
          </div>
        </div>

        {/* Top productos aplicados */}
        {top3.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Más aplicados
            </p>
            <ul className="space-y-1">
              {top3.map((p) => (
                <li
                  key={p.producto}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="capitalize text-foreground/80">{p.producto}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {formatNumber(p.cantidad, p.cantidad % 1 === 0 ? 0 : 1)} {p.unidad}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mini timeline (las últimas 4 labores) */}
        {detalle.labores.length > 0 && (
          <div className="mt-auto border-t border-border/40 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Timeline
              </p>
              <span className="font-mono text-[10px] text-muted-foreground/70">
                últimas {Math.min(4, detalle.labores.length)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {detalle.labores.slice(0, 4).reverse().map((l, i) => (
                <div
                  key={i}
                  className="group flex-1 rounded-sm bg-campo-500/30 ring-1 ring-campo-500/40 transition-all hover:bg-campo-400/60"
                  style={{ height: 22 }}
                  title={`${formatDateAR(l.fecha)} — ${l.insumosResumen.slice(0, 50)}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-muted/40 p-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
