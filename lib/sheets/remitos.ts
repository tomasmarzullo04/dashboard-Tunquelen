import { readRange } from "./client";
import { parseSheetDate } from "../utils/dates";
import { parseNumberAR } from "../utils/numbers";
import type { Remito } from "../types/sheets";

const SHEET = process.env.SHEET_REMITOS || "Remitos";

export async function fetchRemitos(): Promise<Remito[]> {
  const { rows } = await readRange(`${SHEET}!A:F`);
  return rows
    .filter((r) => r.length > 0 && (r[0] || r[1] || r[2]))
    .map((r) => ({
      fecha: parseSheetDate(r[0]),
      numero: (r[1] || "").trim(),
      proveedor: (r[2] || "").trim(),
      producto: (r[3] || "").trim(),
      cantidad: parseNumberAR(r[4]),
      fileName: (r[5] || "").trim(),
    }));
}
