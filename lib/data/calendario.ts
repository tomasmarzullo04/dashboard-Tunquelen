import { isSameDay } from "date-fns";
import type { Factura } from "@/lib/types/sheets";
import { CALENDARIO_SANITARIO_MOCK } from "./ganaderia";

export type EventoTipo = "vencimiento" | "vacunacion" | "labor_planificada" | "recordatorio";

export interface EventoCalendario {
  fecha: Date;
  tipo: EventoTipo;
  titulo: string;
  subtitulo?: string;
  monto?: number;
  moneda?: string;
}

export const EVENTO_CAL_META: Record<EventoTipo, { label: string; tint: string; dot: string }> = {
  vencimiento:        { label: "Vencimiento",        tint: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  vacunacion:         { label: "Vacunación",         tint: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  labor_planificada:  { label: "Labor planificada",  tint: "bg-campo-500/20 text-campo-400 border-campo-500/30", dot: "bg-campo-400" },
  recordatorio:       { label: "Recordatorio",       tint: "bg-violet-500/15 text-violet-400 border-violet-500/30", dot: "bg-violet-400" },
};

function day(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

// Algunas labores planificadas + recordatorios — mock con sentido agronómico.
const LABORES_PLANIFICADAS_MOCK: EventoCalendario[] = [
  { fecha: day(4),  tipo: "labor_planificada", titulo: "Fertilización Lote 7B", subtitulo: "Urea — 150 kg/ha" },
  { fecha: day(10), tipo: "labor_planificada", titulo: "Aplicación selectiva Lote 4+6", subtitulo: "Herbicidas pre-siembra" },
  { fecha: day(18), tipo: "labor_planificada", titulo: "Siembra Lote 7A", subtitulo: "Girasol — contratista" },
  { fecha: day(32), tipo: "labor_planificada", titulo: "Siembra Lote 8", subtitulo: "Girasol — contratista" },
];

const RECORDATORIOS_MOCK: EventoCalendario[] = [
  { fecha: day(7),  tipo: "recordatorio", titulo: "Llamar contratista cosecha", subtitulo: "Confirmar disponibilidad" },
  { fecha: day(20), tipo: "recordatorio", titulo: "Revisar precios pre-cosecha", subtitulo: "Trigo en Bolsa" },
];

export function buildEventos(facturas: Factura[]): EventoCalendario[] {
  const events: EventoCalendario[] = [];

  // Vencimientos de facturas (futuros 90 días)
  const now = new Date();
  for (const f of facturas) {
    if (!f.fechaVencimiento) continue;
    const diff = (f.fechaVencimiento.getTime() - now.getTime()) / 86_400_000;
    if (diff < 0 || diff > 90) continue;
    events.push({
      fecha: f.fechaVencimiento,
      tipo: "vencimiento",
      titulo: f.proveedor || "Vencimiento",
      subtitulo: f.numero ? `Factura ${f.numero}` : undefined,
      monto: f.total,
      moneda: f.moneda,
    });
  }

  // Calendario sanitario
  for (const v of CALENDARIO_SANITARIO_MOCK) {
    events.push({
      fecha: v.fecha,
      tipo: "vacunacion",
      titulo: v.vacuna,
      subtitulo: `${v.categoria} · ${v.cabezas} cabezas`,
    });
  }

  events.push(...LABORES_PLANIFICADAS_MOCK);
  events.push(...RECORDATORIOS_MOCK);

  return events.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

export function eventosDelDia(events: EventoCalendario[], date: Date): EventoCalendario[] {
  return events.filter((e) => isSameDay(e.fecha, date));
}
