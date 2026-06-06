import { readRange } from "./client";
import { parseSheetDate } from "../utils/dates";
import type { OrdenTrabajo } from "../types/sheets";

const SHEET = process.env.SHEET_LABORES || "Orden de trabajo";

export async function fetchLabores(): Promise<OrdenTrabajo[]> {
  const { rows } = await readRange(`${SHEET}!A:F`);
  return rows
    .filter((r) => r.length > 0 && (r[0] || r[2]))
    .map((r) => ({
      fecha: parseSheetDate(r[0]),
      hora: (r[1] || "").trim(),
      loteOCultivo: (r[2] || "").trim(),
      insumosDetalle: (r[3] || "").trim(),
      insumosResumen: (r[4] || "").trim(),
      observaciones: (r[5] || "").trim(),
    }));
}
