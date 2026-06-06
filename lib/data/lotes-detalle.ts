import type { OrdenTrabajo } from "@/lib/types/sheets";
import { LOTES, type Lote } from "./lotes";

export interface LaborDeLote {
  fecha: Date | null;
  hora: string;
  insumosResumen: string;
  observaciones: string;
}

export interface LoteDetalle extends Lote {
  labores: LaborDeLote[];
  ultimaLabor: LaborDeLote | null;
  diasDesdeUltimaLabor: number | null;
  cantidadLabores: number;
  /** Extracción: lista de productos detectados en los insumos aplicados, con cantidad total. */
  productosAplicados: { producto: string; cantidad: number; unidad: string }[];
}

/** Regex laxo para extraer "120L glifosato", "400gr metsulfurón", "12L Voraxor", "10L Acción", "20kg semilla". */
const PROD_REGEX = /(\d+(?:[.,]\d+)?)\s*(L|l|lt|lts|kg|kgs|gr|g|cc)\s+([\p{L}\d-]+(?:\s+[\p{L}\d-]+)?)/giu;

function normalizeUnit(u: string): string {
  const x = u.toLowerCase();
  if (x.startsWith("l")) return "L";
  if (x.startsWith("kg")) return "kg";
  if (x === "gr" || x === "g") return "gr";
  if (x === "cc") return "cc";
  return u;
}

function loteMatches(labor: OrdenTrabajo, lote: Lote): boolean {
  const norm = labor.loteOCultivo.toLowerCase().replace(/\s+/g, "");
  const nombre = lote.nombre.toLowerCase().replace(/\s+/g, "");
  const id = lote.id.toLowerCase().replace(/\s+/g, "");
  return norm.includes(nombre) || norm.includes(id);
}

export function computeLotesDetalle(labores: OrdenTrabajo[], now = new Date()): LoteDetalle[] {
  return LOTES.map((lote) => {
    const lotLabores = labores
      .filter((l) => loteMatches(l, lote))
      .sort((a, b) => {
        const aT = a.fecha?.getTime() ?? 0;
        const bT = b.fecha?.getTime() ?? 0;
        return bT - aT;
      });

    const ultima = lotLabores[0] ?? null;
    const dias = ultima?.fecha
      ? Math.floor((now.getTime() - ultima.fecha.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Acumulación de productos
    const productosMap = new Map<string, { cantidad: number; unidad: string }>();
    for (const l of lotLabores) {
      const text = `${l.insumosResumen} ${l.insumosDetalle}`;
      const matches = text.matchAll(PROD_REGEX);
      for (const m of matches) {
        const cantidad = parseFloat(m[1].replace(",", "."));
        const unidad = normalizeUnit(m[2]);
        const producto = m[3].trim().toLowerCase();
        if (!Number.isFinite(cantidad)) continue;
        const key = `${producto}|${unidad}`;
        const prev = productosMap.get(key);
        productosMap.set(key, {
          cantidad: (prev?.cantidad ?? 0) + cantidad,
          unidad,
        });
      }
    }

    const productosAplicados = Array.from(productosMap.entries())
      .map(([key, v]) => {
        const [producto] = key.split("|");
        return { producto, cantidad: v.cantidad, unidad: v.unidad };
      })
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      ...lote,
      labores: lotLabores.map((l) => ({
        fecha: l.fecha,
        hora: l.hora,
        insumosResumen: l.insumosResumen,
        observaciones: l.observaciones,
      })),
      ultimaLabor: ultima
        ? {
            fecha: ultima.fecha,
            hora: ultima.hora,
            insumosResumen: ultima.insumosResumen,
            observaciones: ultima.observaciones,
          }
        : null,
      diasDesdeUltimaLabor: dias,
      cantidadLabores: lotLabores.length,
      productosAplicados,
    };
  });
}

/** Progreso del lote dentro de la campaña, según estado. */
export function progresoLote(estado: Lote["estado"]): number {
  switch (estado) {
    case "pendiente": return 5;
    case "preparacion": return 25;
    case "sembrado": return 45;
    case "en_crecimiento": return 65;
    case "en_cosecha": return 85;
    case "cosechado": return 100;
  }
}
