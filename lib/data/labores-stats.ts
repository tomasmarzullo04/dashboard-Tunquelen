import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import type { OrdenTrabajo } from "@/lib/types/sheets";

export interface HeatmapCell {
  date: Date;
  count: number;
  isoDate: string;
}

export interface InsumoAplicado {
  producto: string;
  cantidad: number;
  unidad: string;
  /** En cuántas labores apareció */
  ocurrencias: number;
}

export interface LaboresStats {
  total: number;
  totalUltimos30d: number;
  totalUltimos90d: number;
  porLote: { lote: string; cantidad: number }[];
  heatmap: HeatmapCell[];
  topInsumos: InsumoAplicado[];
}

const PROD_REGEX = /(\d+(?:[.,]\d+)?)\s*(L|l|lt|lts|kg|kgs|gr|g|cc)\s+([\p{L}\d-]+(?:\s+[\p{L}\d-]+)?)/giu;

function normalizeUnit(u: string): string {
  const x = u.toLowerCase();
  if (x.startsWith("l")) return "L";
  if (x.startsWith("kg")) return "kg";
  if (x === "gr" || x === "g") return "gr";
  if (x === "cc") return "cc";
  return u;
}

export function computeLaboresStats(labores: OrdenTrabajo[], now = new Date()): LaboresStats {
  // Heatmap últimos 180 días (≈ 6 meses)
  const from = subDays(now, 180);
  const days = eachDayOfInterval({ start: from, end: now });
  const heatmap: HeatmapCell[] = days.map((d) => ({
    date: d,
    isoDate: format(d, "yyyy-MM-dd"),
    count: labores.filter((l) => l.fecha && isSameDay(l.fecha, d)).length,
  }));

  // Por lote
  const lotMap = new Map<string, number>();
  for (const l of labores) {
    const key = l.loteOCultivo || "Sin lote";
    lotMap.set(key, (lotMap.get(key) ?? 0) + 1);
  }
  const porLote = Array.from(lotMap.entries())
    .map(([lote, cantidad]) => ({ lote, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // Top insumos (de los últimos 180 días)
  const recientes = labores.filter((l) => l.fecha && l.fecha >= from);
  const insumoMap = new Map<string, InsumoAplicado>();
  for (const l of recientes) {
    const seen = new Set<string>();
    const text = `${l.insumosResumen} ${l.insumosDetalle}`;
    const matches = text.matchAll(PROD_REGEX);
    for (const m of matches) {
      const cantidad = parseFloat(m[1].replace(",", "."));
      const unidad = normalizeUnit(m[2]);
      const producto = m[3].trim().toLowerCase();
      if (!Number.isFinite(cantidad)) continue;
      const key = `${producto}|${unidad}`;
      const prev = insumoMap.get(key);
      const yaContado = seen.has(key);
      seen.add(key);
      insumoMap.set(key, {
        producto,
        unidad,
        cantidad: (prev?.cantidad ?? 0) + cantidad,
        ocurrencias: (prev?.ocurrencias ?? 0) + (yaContado ? 0 : 1),
      });
    }
  }
  const topInsumos = Array.from(insumoMap.values())
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 8);

  const totalUltimos30d = labores.filter((l) => l.fecha && l.fecha >= subDays(now, 30)).length;
  const totalUltimos90d = labores.filter((l) => l.fecha && l.fecha >= subDays(now, 90)).length;

  return {
    total: labores.length,
    totalUltimos30d,
    totalUltimos90d,
    porLote,
    heatmap,
    topInsumos,
  };
}
