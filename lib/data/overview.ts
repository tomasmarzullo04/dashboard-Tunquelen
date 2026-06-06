import { differenceInDays, format, startOfMonth, endOfMonth, subMonths, isWithinInterval, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import type { Factura, LiquidacionGrano, OrdenTrabajo } from "@/lib/types/sheets";
import { LOTES } from "./lotes";
import type { IngresosGastosPoint } from "@/components/charts/IngresosGastosChart";
import type { VencimientoItem } from "@/components/cards/VencimientosList";
import type { LaborFeedEntry } from "@/components/cards/LaboresFeed";

export interface OverviewKpis {
  ingresosMes: number;
  gastosMes: number;
  resultadoMes: number;
  hectareasMes: number;
  laboresMes: number;
  proximoVencimientoDias: number | null;
  proximoVencimientoProveedor: string | null;

  // deltas (porcentajes)
  deltaIngresos: number | null;
  deltaGastos: number | null;
  deltaResultado: number | null;
  deltaHectareas: number | null;
  deltaLabores: number | null;
}

export interface OverviewData {
  kpis: OverviewKpis;
  serie12m: IngresosGastosPoint[];
  vencimientos: VencimientoItem[];
  ultimasLabores: LaborFeedEntry[];
  mesActualLabel: string;
}

function deltaPct(actual: number, anterior: number): number | null {
  if (anterior === 0) return actual === 0 ? 0 : null;
  return ((actual - anterior) / Math.abs(anterior)) * 100;
}

function sumEntre(items: { fecha: Date | null; valor: number }[], from: Date, to: Date) {
  return items
    .filter((i) => i.fecha && isWithinInterval(i.fecha, { start: from, end: to }))
    .reduce((s, i) => s + i.valor, 0);
}

function laboresEntre(labores: OrdenTrabajo[], from: Date, to: Date) {
  return labores.filter((l) => l.fecha && isWithinInterval(l.fecha, { start: from, end: to }));
}

/** Mapea el campo loteOCultivo a hectáreas conocidas. Si no matchea, devuelve 0. */
function haDeLote(loteOCultivo: string): number {
  const norm = loteOCultivo.toLowerCase().replace(/\s+/g, "");
  const match = LOTES.find((l) => {
    const n = l.nombre.toLowerCase().replace(/\s+/g, "");
    return norm.includes(n) || norm.includes(l.id.toLowerCase());
  });
  return match?.hectareas ?? 0;
}

function hectareasUnicas(labores: OrdenTrabajo[]): number {
  const lotesUnicos = new Set<string>();
  let total = 0;
  for (const l of labores) {
    const match = LOTES.find((lot) => {
      const norm = l.loteOCultivo.toLowerCase().replace(/\s+/g, "");
      const n = lot.nombre.toLowerCase().replace(/\s+/g, "");
      return norm.includes(n) || norm.includes(lot.id.toLowerCase());
    });
    if (match && !lotesUnicos.has(match.id)) {
      lotesUnicos.add(match.id);
      total += match.hectareas;
    } else if (!match) {
      total += haDeLote(l.loteOCultivo);
    }
  }
  return total;
}

export function computeOverview(args: {
  facturas: Factura[];
  liquidaciones: LiquidacionGrano[];
  labores: OrdenTrabajo[];
  now?: Date;
}): OverviewData {
  const now = args.now ?? new Date();

  const inicioMes = startOfMonth(now);
  const finMes = endOfMonth(now);
  const inicioMesAnt = startOfMonth(subMonths(now, 1));
  const finMesAnt = endOfMonth(subMonths(now, 1));

  const gastosMap = args.facturas.map((f) => ({ fecha: f.fechaEmision, valor: f.total }));
  const ingresosMap = args.liquidaciones.map((l) => ({ fecha: l.fecha, valor: l.total }));

  const ingresosMes = sumEntre(ingresosMap, inicioMes, finMes);
  const ingresosMesAnt = sumEntre(ingresosMap, inicioMesAnt, finMesAnt);
  const gastosMes = sumEntre(gastosMap, inicioMes, finMes);
  const gastosMesAnt = sumEntre(gastosMap, inicioMesAnt, finMesAnt);

  const laboresMesArr = laboresEntre(args.labores, inicioMes, finMes);
  const laboresMesAntArr = laboresEntre(args.labores, inicioMesAnt, finMesAnt);

  const hectareasMes = hectareasUnicas(laboresMesArr);
  const hectareasMesAnt = hectareasUnicas(laboresMesAntArr);

  // Próximo vencimiento
  const futuros = args.facturas
    .filter((f) => f.fechaVencimiento && isAfter(f.fechaVencimiento, now))
    .sort((a, b) => (a.fechaVencimiento!.getTime() - b.fechaVencimiento!.getTime()));
  const proximo = futuros[0];
  const proximoDias = proximo?.fechaVencimiento ? differenceInDays(proximo.fechaVencimiento, now) : null;

  // Serie 12 meses
  const serie12m: IngresosGastosPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const ref = subMonths(now, i);
    const from = startOfMonth(ref);
    const to = endOfMonth(ref);
    const ingresos = sumEntre(ingresosMap, from, to);
    const gastos = sumEntre(gastosMap, from, to);
    serie12m.push({
      monthKey: format(ref, "yyyy-MM"),
      monthLabel: format(ref, "LLL", { locale: es }).replace(".", ""),
      ingresos,
      gastos,
      resultado: ingresos - gastos,
    });
  }

  // Próximos vencimientos (hasta 30 días)
  const vencimientos: VencimientoItem[] = args.facturas
    .filter((f) => {
      if (!f.fechaVencimiento) return false;
      const dias = differenceInDays(f.fechaVencimiento, now);
      return dias >= 0 && dias <= 30;
    })
    .map((f) => ({
      proveedor: f.proveedor,
      numero: f.numero,
      fechaVencimiento: f.fechaVencimiento,
      total: f.total,
      moneda: f.moneda,
      diasRestantes: differenceInDays(f.fechaVencimiento!, now),
    }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 6);

  // Últimas labores
  const ultimasLabores: LaborFeedEntry[] = args.labores
    .filter((l) => l.fecha)
    .sort((a, b) => b.fecha!.getTime() - a.fecha!.getTime())
    .slice(0, 6)
    .map((l) => ({
      fecha: l.fecha,
      hora: l.hora,
      loteOCultivo: l.loteOCultivo,
      insumosResumen: l.insumosResumen || l.insumosDetalle,
      observaciones: l.observaciones,
    }));

  const kpis: OverviewKpis = {
    ingresosMes,
    gastosMes,
    resultadoMes: ingresosMes - gastosMes,
    hectareasMes,
    laboresMes: laboresMesArr.length,
    proximoVencimientoDias: proximoDias,
    proximoVencimientoProveedor: proximo?.proveedor ?? null,

    deltaIngresos: deltaPct(ingresosMes, ingresosMesAnt),
    deltaGastos: deltaPct(gastosMes, gastosMesAnt),
    deltaResultado: deltaPct(ingresosMes - gastosMes, ingresosMesAnt - gastosMesAnt),
    deltaHectareas: deltaPct(hectareasMes, hectareasMesAnt),
    deltaLabores: deltaPct(laboresMesArr.length, laboresMesAntArr.length),
  };

  return {
    kpis,
    serie12m,
    vencimientos,
    ultimasLabores,
    mesActualLabel: format(now, "MMMM yyyy", { locale: es }),
  };
}
