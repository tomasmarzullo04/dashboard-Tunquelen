/**
 * Datos mock de ganadería. Reemplazar por lectura de Sheets cuando se cargue.
 */

export type CategoriaGanado = "vacas" | "vaquillonas" | "terneros" | "toros";

export interface CategoriaInfo {
  categoria: CategoriaGanado;
  label: string;
  cabezas: number;
  color: string;
}

export const RODEO_MOCK: CategoriaInfo[] = [
  { categoria: "vacas",       label: "Vacas madre", cabezas: 38, color: "#2E7D32" },
  { categoria: "vaquillonas", label: "Vaquillonas", cabezas: 12, color: "#43A047" },
  { categoria: "terneros",    label: "Terneros",    cabezas: 8,  color: "#D4A574" },
  { categoria: "toros",       label: "Toros",       cabezas: 2,  color: "#A6824E" },
];

export const TOTAL_CABEZAS = RODEO_MOCK.reduce((s, r) => s + r.cabezas, 0);

export interface VacunacionProgramada {
  fecha: Date;
  vacuna: string;
  categoria: string;
  cabezas: number;
  notas?: string;
}

const HOY = new Date();
function fecha(daysFromNow: number): Date {
  const d = new Date(HOY);
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

export const CALENDARIO_SANITARIO_MOCK: VacunacionProgramada[] = [
  { fecha: fecha(12), vacuna: "Aftosa",       categoria: "Todo el rodeo", cabezas: 60, notas: "Campaña otoñal SENASA" },
  { fecha: fecha(28), vacuna: "Brucelosis",   categoria: "Terneras 3–8 meses", cabezas: 6 },
  { fecha: fecha(45), vacuna: "Carbunclo",    categoria: "Todo el rodeo", cabezas: 60 },
  { fecha: fecha(72), vacuna: "Reproductiva", categoria: "Vacas + vaquillonas", cabezas: 50, notas: "IBR + DVB + Lepto" },
];

export interface EventoRodeo {
  fecha: Date;
  tipo: "nacimiento" | "venta" | "mortandad" | "compra" | "destete";
  detalle: string;
  cantidad: number;
}

export const EVENTOS_RECIENTES_MOCK: EventoRodeo[] = [
  { fecha: fecha(-3),  tipo: "nacimiento", detalle: "Ternero nacido — vaca #34",           cantidad: 1 },
  { fecha: fecha(-9),  tipo: "nacimiento", detalle: "Ternero nacido — vaquillona #07",     cantidad: 1 },
  { fecha: fecha(-15), tipo: "destete",    detalle: "Destete de lote de 4 terneros",        cantidad: 4 },
  { fecha: fecha(-22), tipo: "compra",     detalle: "Compra de toro reproductor — Angus", cantidad: 1 },
  { fecha: fecha(-41), tipo: "venta",      detalle: "Venta de 6 vaquillonas a faena",      cantidad: 6 },
];

export const EVENTO_META: Record<EventoRodeo["tipo"], { label: string; color: string; dot: string }> = {
  nacimiento: { label: "Nacimiento", color: "text-emerald-400",  dot: "bg-emerald-400" },
  venta:      { label: "Venta",      color: "text-trigo",        dot: "bg-trigo" },
  compra:     { label: "Compra",     color: "text-sky-400",      dot: "bg-sky-400" },
  mortandad:  { label: "Mortandad",  color: "text-red-400",      dot: "bg-red-400" },
  destete:    { label: "Destete",    color: "text-violet-400",   dot: "bg-violet-400" },
};
