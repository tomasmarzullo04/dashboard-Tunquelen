import { readRange } from "./client";
import { parseSheetDate } from "../utils/dates";
import { parseNumberAR } from "../utils/numbers";
import type { Factura } from "../types/sheets";

const SHEET = process.env.SHEET_FACTURAS || "Facturas";

export async function fetchFacturas(): Promise<Factura[]> {
  const { rows } = await readRange(`${SHEET}!A:J`);
  return rows
    .filter((r) => r.length > 0 && (r[0] || r[1] || r[3]))
    .map((r) => ({
      fechaEmision: parseSheetDate(r[0]),
      proveedor: (r[1] || "").trim(),
      fechaVencimiento: parseSheetDate(r[2]),
      tipo: (r[3] || "").trim(),
      numero: (r[4] || "").trim(),
      moneda: ((r[5] || "ARS").trim() as Factura["moneda"]) || "ARS",
      neto: parseNumberAR(r[6]),
      iva: parseNumberAR(r[7]),
      total: parseNumberAR(r[8]),
      fileName: (r[9] || "").trim(),
    }));
}
