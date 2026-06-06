/**
 * Configuración de lotes de la campaña 2026/27.
 * En el futuro este archivo puede leerse de una hoja "Lotes" del spreadsheet.
 */

export type EstadoLote =
  | "pendiente"
  | "preparacion"
  | "sembrado"
  | "en_crecimiento"
  | "en_cosecha"
  | "cosechado";

export interface Lote {
  id: string;
  nombre: string;
  hectareas: number;
  cultivoAnterior: string;
  cultivoActual: string;
  estado: EstadoLote;
  /** Posición en el plano esquemático (grid 4 cols × 3 rows) */
  grid: { col: number; row: number; colSpan: number; rowSpan: number };
}

export const LOTES: Lote[] = [
  {
    id: "4-6",
    nombre: "Lote 4 + 6",
    hectareas: 38,
    cultivoAnterior: "Trigo/Soja 2ª",
    cultivoActual: "Maíz",
    estado: "preparacion",
    grid: { col: 1, row: 1, colSpan: 2, rowSpan: 1 },
  },
  {
    id: "7A",
    nombre: "Lote 7A",
    hectareas: 37,
    cultivoAnterior: "Maíz",
    cultivoActual: "Girasol",
    estado: "preparacion",
    grid: { col: 3, row: 1, colSpan: 2, rowSpan: 1 },
  },
  {
    id: "7B",
    nombre: "Lote 7B",
    hectareas: 63,
    cultivoAnterior: "Girasol",
    cultivoActual: "Trigo",
    estado: "sembrado",
    grid: { col: 1, row: 2, colSpan: 3, rowSpan: 1 },
  },
  {
    id: "8",
    nombre: "Lote 8",
    hectareas: 32,
    cultivoAnterior: "Maíz",
    cultivoActual: "Girasol",
    estado: "preparacion",
    grid: { col: 4, row: 2, colSpan: 1, rowSpan: 1 },
  },
];

export const TOTAL_HECTAREAS = LOTES.reduce((s, l) => s + l.hectareas, 0);

export const ESTADO_META: Record<EstadoLote, { label: string; color: string; dot: string }> = {
  pendiente:       { label: "Pendiente",        color: "from-slate-500/15 to-slate-500/5",   dot: "bg-slate-400" },
  preparacion:     { label: "En preparación",   color: "from-amber-500/20 to-amber-500/5",   dot: "bg-amber-400" },
  sembrado:        { label: "Sembrado",         color: "from-emerald-500/25 to-emerald-500/5", dot: "bg-emerald-400" },
  en_crecimiento:  { label: "En crecimiento",   color: "from-campo-500/25 to-campo-500/5",   dot: "bg-campo-400" },
  en_cosecha:      { label: "En cosecha",       color: "from-trigo/25 to-trigo/5",           dot: "bg-trigo" },
  cosechado:       { label: "Cosechado",        color: "from-stone-500/15 to-stone-500/5",   dot: "bg-stone-400" },
};

/** Colores asociados a cada cultivo para la visualización */
export const CULTIVO_TINT: Record<string, string> = {
  "Maíz":     "from-yellow-500/30 via-yellow-600/15 to-transparent",
  "Girasol":  "from-orange-500/30 via-orange-600/15 to-transparent",
  "Trigo":    "from-amber-500/30 via-amber-700/15 to-transparent",
  "Soja":     "from-lime-500/30 via-lime-600/15 to-transparent",
};

export function cultivoTint(cultivo: string): string {
  return CULTIVO_TINT[cultivo] ?? "from-campo-500/25 to-transparent";
}
