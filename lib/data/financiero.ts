import { differenceInDays, endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import type { Factura, LiquidacionGrano } from "@/lib/types/sheets";

export interface ProveedorAgg {
  proveedor: string;
  monto: number;
  cantFacturas: number;
  ultimaFactura: Date | null;
}

export interface GranoAgg {
  grano: string;
  volumen: number;       // toneladas
  monto: number;         // ARS
  precioPromedio: number;
  liquidaciones: number;
}

export interface BarraMensual {
  monthKey: string;
  monthLabel: string;
  ingresos: number;
  gastos: number;
}

export interface CuentaCorriente {
  proveedor: string;
  saldoPendiente: number;
  facturasPendientes: number;
  proximoVencimiento: Date | null;
}

export interface FinancieroData {
  totalIngresosAnio: number;
  totalGastosAnio: number;
  resultadoAnio: number;
  totalLiquidaciones: number;
  totalVolumen: number;
  series12m: BarraMensual[];
  topProveedores: ProveedorAgg[];
  granos: GranoAgg[];
  vencimientos60d: {
    proveedor: string;
    numero: string;
    fechaVencimiento: Date | null;
    total: number;
    moneda: string;
    diasRestantes: number;
  }[];
  cuentaCorriente: CuentaCorriente[];
}

export function computeFinanciero(args: {
  facturas: Factura[];
  liquidaciones: LiquidacionGrano[];
  now?: Date;
}): FinancieroData {
  const now = args.now ?? new Date();
  const desde = startOfMonth(subMonths(now, 11));
  const hasta = endOfMonth(now);

  // Serie 12 meses
  const series12m: BarraMensual[] = [];
  for (let i = 11; i >= 0; i--) {
    const ref = subMonths(now, i);
    const from = startOfMonth(ref);
    const to = endOfMonth(ref);
    const ingresos = args.liquidaciones
      .filter((l) => l.fecha && isWithinInterval(l.fecha, { start: from, end: to }))
      .reduce((s, l) => s + l.total, 0);
    const gastos = args.facturas
      .filter((f) => f.fechaEmision && isWithinInterval(f.fechaEmision, { start: from, end: to }))
      .reduce((s, f) => s + f.total, 0);
    series12m.push({
      monthKey: format(ref, "yyyy-MM"),
      monthLabel: format(ref, "LLL", { locale: es }).replace(".", ""),
      ingresos,
      gastos,
    });
  }

  // Top proveedores (últimos 12 meses)
  const provMap = new Map<string, ProveedorAgg>();
  for (const f of args.facturas) {
    if (!f.fechaEmision || !isWithinInterval(f.fechaEmision, { start: desde, end: hasta })) continue;
    const key = f.proveedor || "Sin proveedor";
    const prev = provMap.get(key);
    provMap.set(key, {
      proveedor: key,
      monto: (prev?.monto ?? 0) + f.total,
      cantFacturas: (prev?.cantFacturas ?? 0) + 1,
      ultimaFactura: prev?.ultimaFactura
        ? f.fechaEmision > prev.ultimaFactura
          ? f.fechaEmision
          : prev.ultimaFactura
        : f.fechaEmision,
    });
  }
  const topProveedores = Array.from(provMap.values())
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5);

  // Granos
  const granosMap = new Map<string, GranoAgg>();
  for (const l of args.liquidaciones) {
    const key = (l.grano || "Sin grano").toLowerCase();
    const niceKey = l.grano || "Sin grano";
    const prev = granosMap.get(key);
    granosMap.set(key, {
      grano: niceKey.charAt(0).toUpperCase() + niceKey.slice(1).toLowerCase(),
      volumen: (prev?.volumen ?? 0) + l.volumen,
      monto: (prev?.monto ?? 0) + l.total,
      precioPromedio: 0, // se calcula después
      liquidaciones: (prev?.liquidaciones ?? 0) + 1,
    });
  }
  const granos = Array.from(granosMap.values())
    .map((g) => ({ ...g, precioPromedio: g.volumen > 0 ? g.monto / g.volumen : 0 }))
    .sort((a, b) => b.monto - a.monto);

  // Vencimientos próximos 60 días
  const vencimientos60d = args.facturas
    .filter((f) => {
      if (!f.fechaVencimiento) return false;
      const d = differenceInDays(f.fechaVencimiento, now);
      return d >= 0 && d <= 60;
    })
    .map((f) => ({
      proveedor: f.proveedor,
      numero: f.numero,
      fechaVencimiento: f.fechaVencimiento,
      total: f.total,
      moneda: f.moneda,
      diasRestantes: differenceInDays(f.fechaVencimiento!, now),
    }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  // Cuenta corriente: facturas con vencimiento hoy o en el futuro (pendientes)
  const ccMap = new Map<string, CuentaCorriente>();
  for (const f of args.facturas) {
    if (!f.fechaVencimiento || differenceInDays(f.fechaVencimiento, now) < 0) continue;
    const key = f.proveedor || "Sin proveedor";
    const prev = ccMap.get(key);
    ccMap.set(key, {
      proveedor: key,
      saldoPendiente: (prev?.saldoPendiente ?? 0) + f.total,
      facturasPendientes: (prev?.facturasPendientes ?? 0) + 1,
      proximoVencimiento:
        prev?.proximoVencimiento && prev.proximoVencimiento < f.fechaVencimiento
          ? prev.proximoVencimiento
          : f.fechaVencimiento,
    });
  }
  const cuentaCorriente = Array.from(ccMap.values()).sort((a, b) => b.saldoPendiente - a.saldoPendiente);

  const totalIngresosAnio = series12m.reduce((s, m) => s + m.ingresos, 0);
  const totalGastosAnio = series12m.reduce((s, m) => s + m.gastos, 0);

  return {
    totalIngresosAnio,
    totalGastosAnio,
    resultadoAnio: totalIngresosAnio - totalGastosAnio,
    totalLiquidaciones: args.liquidaciones.length,
    totalVolumen: granos.reduce((s, g) => s + g.volumen, 0),
    series12m,
    topProveedores,
    granos,
    vencimientos60d,
    cuentaCorriente,
  };
}
