/**
 * Parsea números que vienen de Sheets con formato argentino: "1.234.567,89" → 1234567.89
 * Tolerante a strings vacíos, símbolos de moneda y espacios.
 */
export function parseNumberAR(raw: string | number | undefined | null): number {
  if (raw == null || raw === "") return 0;
  if (typeof raw === "number") return raw;

  const cleaned = String(raw)
    .replace(/[$\s]/g, "")
    .replace(/[A-Za-z]/g, "")
    .trim();

  if (!cleaned) return 0;

  // Heurística: si hay coma y punto, asumimos punto = miles, coma = decimal (formato AR).
  // Si solo hay punto y aparece como separador decimal (1 o 2 dígitos después), respetar.
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  let normalized: string;
  if (hasComma && hasDot) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = cleaned.replace(",", ".");
  } else {
    normalized = cleaned;
  }

  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}
