import { format, parse, isValid, differenceInDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Parsea fechas que vienen de Sheets en formato DD/MM/YYYY (o variantes con guiones).
 * Devuelve null si no parsea.
 */
export function parseSheetDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  const patterns = ["dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "d-M-yyyy", "yyyy-MM-dd", "yyyy/MM/dd"];
  for (const p of patterns) {
    const d = parse(s, p, new Date());
    if (isValid(d)) return d;
  }
  // Fallback: Date constructor
  const fallback = new Date(s);
  return isValid(fallback) ? fallback : null;
}

export function formatDateAR(d: Date | null | undefined, pattern = "dd/MM/yyyy") {
  if (!d || !isValid(d)) return "—";
  return format(d, pattern, { locale: es });
}

export function formatMonthAR(d: Date) {
  return format(d, "MMMM yyyy", { locale: es });
}

export function formatRelativeAR(d: Date | null) {
  if (!d) return "—";
  const days = differenceInDays(d, new Date());
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days === -1) return "ayer";
  if (days > 0 && days <= 30) return `en ${days} días`;
  if (days < 0 && days >= -30) return `hace ${Math.abs(days)} días`;
  return formatDateAR(d);
}

export { startOfMonth, endOfMonth, subMonths, differenceInDays };
