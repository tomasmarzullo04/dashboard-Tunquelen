/**
 * Datos mock de stock de insumos. Reemplazar por lectura de Sheets cuando exista esa hoja.
 */

export interface ItemStock {
  id: string;
  nombre: string;
  categoria: "herbicida" | "fertilizante" | "semilla" | "fungicida" | "insecticida" | "otro";
  cantidad: number;
  unidad: "L" | "kg" | "bolsas";
  umbralAlerta: number;
  /** Hectáreas que alcanza el stock actual asumiendo dosis típica */
  cobertura: { ha: number; dosis: string };
  /** Última compra */
  ultimaCompra: Date | null;
}

function date(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export const STOCK_MOCK: ItemStock[] = [
  {
    id: "glifosato-48",
    nombre: "Glifosato 48%",
    categoria: "herbicida",
    cantidad: 480,
    unidad: "L",
    umbralAlerta: 200,
    cobertura: { ha: 160, dosis: "3 L/ha" },
    ultimaCompra: date(-18),
  },
  {
    id: "metsulfuron",
    nombre: "Metsulfurón metil",
    categoria: "herbicida",
    cantidad: 1.2,
    unidad: "kg",
    umbralAlerta: 1.5,
    cobertura: { ha: 60, dosis: "20 gr/ha" },
    ultimaCompra: date(-32),
  },
  {
    id: "voraxor",
    nombre: "Voraxor",
    categoria: "herbicida",
    cantidad: 32,
    unidad: "L",
    umbralAlerta: 40,
    cobertura: { ha: 25, dosis: "1,3 L/ha" },
    ultimaCompra: date(-12),
  },
  {
    id: "accion-coadyuvante",
    nombre: "Acción (coadyuvante)",
    categoria: "otro",
    cantidad: 18,
    unidad: "L",
    umbralAlerta: 20,
    cobertura: { ha: 60, dosis: "300 cc/ha" },
    ultimaCompra: date(-12),
  },
  {
    id: "urea-46",
    nombre: "Urea granulada 46%",
    categoria: "fertilizante",
    cantidad: 4500,
    unidad: "kg",
    umbralAlerta: 2000,
    cobertura: { ha: 30, dosis: "150 kg/ha" },
    ultimaCompra: date(-48),
  },
  {
    id: "semilla-maiz",
    nombre: "Semilla maíz DK7220",
    categoria: "semilla",
    cantidad: 22,
    unidad: "bolsas",
    umbralAlerta: 38,
    cobertura: { ha: 28, dosis: "1 b/1.4 ha" },
    ultimaCompra: date(-65),
  },
  {
    id: "semilla-girasol",
    nombre: "Semilla girasol AGSEED 6610",
    categoria: "semilla",
    cantidad: 30,
    unidad: "bolsas",
    umbralAlerta: 28,
    cobertura: { ha: 60, dosis: "1 b/2.1 ha" },
    ultimaCompra: date(-22),
  },
  {
    id: "aceite-mineral",
    nombre: "Aceite mineral",
    categoria: "otro",
    cantidad: 0,
    unidad: "L",
    umbralAlerta: 20,
    cobertura: { ha: 0, dosis: "500 cc/ha" },
    ultimaCompra: date(-92),
  },
];

export const CATEGORIA_META: Record<ItemStock["categoria"], { label: string; tint: string }> = {
  herbicida:    { label: "Herbicida",    tint: "bg-emerald-500/15 text-emerald-400" },
  fungicida:    { label: "Fungicida",    tint: "bg-cyan-500/15 text-cyan-400" },
  insecticida:  { label: "Insecticida",  tint: "bg-violet-500/15 text-violet-400" },
  fertilizante: { label: "Fertilizante", tint: "bg-amber-500/15 text-amber-400" },
  semilla:      { label: "Semilla",      tint: "bg-trigo/20 text-trigo" },
  otro:         { label: "Otros",        tint: "bg-slate-500/15 text-slate-400" },
};

export function nivelStock(item: ItemStock): "ok" | "bajo" | "critico" | "agotado" {
  if (item.cantidad === 0) return "agotado";
  if (item.cantidad < item.umbralAlerta * 0.5) return "critico";
  if (item.cantidad < item.umbralAlerta) return "bajo";
  return "ok";
}
