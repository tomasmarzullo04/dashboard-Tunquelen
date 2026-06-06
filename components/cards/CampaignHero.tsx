"use client";

import { Wheat, MapPin, Sun, Wind } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TOTAL_HECTAREAS, LOTES } from "@/lib/data/lotes";

interface Props {
  now?: Date;
}

/**
 * Hero del Overview con info contextual del campo y progreso de la campaña.
 * La campaña 2026/27 va aprox de Julio 2026 a Junio 2027.
 */
export function CampaignHero({ now: nowProp }: Props) {
  const now = nowProp ?? new Date();
  const campaignStart = new Date(2026, 6, 1); // 1 Jul 2026
  const campaignEnd = new Date(2027, 5, 30);  // 30 Jun 2027
  const total = campaignEnd.getTime() - campaignStart.getTime();
  const elapsed = Math.max(0, Math.min(total, now.getTime() - campaignStart.getTime()));
  const progress = (elapsed / total) * 100;

  const cultivos = Array.from(new Set(LOTES.map((l) => l.cultivoActual)));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-campo-700/10 p-6">
      {/* Decoración de fondo: trigo / surcos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, currentColor 0 1px, transparent 1px 16px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-campo-500/30 via-campo-600/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gradient-to-br from-trigo/20 to-transparent blur-3xl"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Gral. Pueyrredón · Buenos Aires</span>
            <span className="opacity-40">·</span>
            <span className="capitalize">{format(now, "EEEE d 'de' MMMM", { locale: es })}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Buen día — esto es lo que pasa hoy en{" "}
            <span className="bg-gradient-to-r from-campo-400 via-campo-500 to-trigo bg-clip-text text-transparent">
              Tunquelen
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Wheat className="h-3.5 w-3.5 text-trigo" />
              <span className="font-mono tabular-nums">{TOTAL_HECTAREAS} ha</span> agrícolas
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              60 cabezas
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-sky-400" />
              {cultivos.join(" · ")}
            </span>
          </div>
        </div>

        {/* Progreso de campaña */}
        <div className="w-full max-w-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium uppercase tracking-wider text-muted-foreground">
              Campaña 2026/27
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-muted/50">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-campo-600 via-campo-400 to-trigo transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/30 mix-blend-overlay"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
            <span>Jul 26</span>
            <span>Ene 27</span>
            <span>Jun 27</span>
          </div>
        </div>
      </div>
    </div>
  );
}
