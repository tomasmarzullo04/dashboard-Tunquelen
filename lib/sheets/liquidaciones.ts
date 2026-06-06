import { readRange } from "./client";
import { parseSheetDate } from "../utils/dates";
import { parseNumberAR } from "../utils/numbers";
import type { LiquidacionGrano } from "../types/sheets";

const SHEET = process.env.SHEET_LIQUIDACIONES || "Liquidacion de Granos";

export async function fetchLiquidaciones(): Promise<LiquidacionGrano[]> {
  const { rows } = await readRange(`${SHEET}!A:L`);
  return rows
    .filter((r) => r.length > 0 && (r[0] || r[2] || r[3]))
    .map((r) => ({
      fecha: parseSheetDate(r[0]),
      numero: (r[1] || "").trim(),
      comprador: (r[2] || "").trim(),
      grano: (r[3] || "").trim(),
      volumen: parseNumberAR(r[4]),
      precioUnitario: parseNumberAR(r[5]),
      neto: parseNumberAR(r[6]),
      bonificaciones: parseNumberAR(r[7]),
      deducciones: parseNumberAR(r[8]),
      iva: parseNumberAR(r[9]),
      total: parseNumberAR(r[10]),
      archivo: (r[11] || "").trim(),
    }));
}
