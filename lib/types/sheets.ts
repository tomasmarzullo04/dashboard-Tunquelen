export type Moneda = "ARS" | "USD" | string;

export interface Factura {
  fechaEmision: Date | null;
  proveedor: string;
  fechaVencimiento: Date | null;
  tipo: string;
  numero: string;
  moneda: Moneda;
  neto: number;
  iva: number;
  total: number;
  fileName: string;
}

export interface Remito {
  fecha: Date | null;
  numero: string;
  proveedor: string;
  producto: string;
  cantidad: number;
  fileName: string;
}

export interface LiquidacionGrano {
  fecha: Date | null;
  numero: string;
  comprador: string;
  grano: string;
  volumen: number;
  precioUnitario: number;
  neto: number;
  bonificaciones: number;
  deducciones: number;
  iva: number;
  total: number;
  archivo: string;
}

export interface OrdenTrabajo {
  fecha: Date | null;
  hora: string;
  loteOCultivo: string;
  insumosDetalle: string;
  insumosResumen: string;
  observaciones: string;
}
