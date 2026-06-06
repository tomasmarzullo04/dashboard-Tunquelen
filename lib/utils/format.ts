/**
 * Formateo argentino: separador de miles con punto, decimal con coma.
 */

const AR = "es-AR";

export function formatARS(value: number, opts?: { decimals?: number; compact?: boolean }) {
  const decimals = opts?.decimals ?? 0;
  if (opts?.compact && Math.abs(value) >= 1_000_000) {
    return new Intl.NumberFormat(AR, {
      style: "currency",
      currency: "ARS",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat(AR, {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatUSD(value: number, decimals = 0) {
  return new Intl.NumberFormat(AR, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat(AR, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatHa(value: number) {
  return `${formatNumber(value, value % 1 === 0 ? 0 : 1)} ha`;
}

export function formatPercent(value: number, decimals = 1) {
  return new Intl.NumberFormat(AR, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercent(value, 1)}`;
}
