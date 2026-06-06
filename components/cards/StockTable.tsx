"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STOCK_MOCK, CATEGORIA_META, nivelStock, type ItemStock } from "@/lib/data/stock";
import { formatNumber } from "@/lib/utils/format";
import { formatDateAR } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";

const NIVEL_META = {
  ok:      { label: "OK",       icon: CheckCircle2, color: "text-emerald-400", bar: "bg-emerald-500" },
  bajo:    { label: "Bajo",     icon: AlertTriangle, color: "text-amber-400",  bar: "bg-amber-500" },
  critico: { label: "Crítico",  icon: AlertCircle,   color: "text-red-400",    bar: "bg-red-500" },
  agotado: { label: "Agotado",  icon: XCircle,       color: "text-red-500",    bar: "bg-red-600" },
} as const;

export function StockTable() {
  const items = [...STOCK_MOCK].sort((a, b) => {
    const order = { agotado: 0, critico: 1, bajo: 2, ok: 3 };
    return order[nivelStock(a)] - order[nivelStock(b)];
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead className="text-right">Cobertura</TableHead>
          <TableHead className="text-right">Última compra</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((it) => (
          <StockRow key={it.id} item={it} />
        ))}
      </TableBody>
    </Table>
  );
}

function StockRow({ item }: { item: ItemStock }) {
  const nivel = nivelStock(item);
  const meta = NIVEL_META[nivel];
  const Icon = meta.icon;
  const cat = CATEGORIA_META[item.categoria];
  const pct = item.umbralAlerta > 0 ? Math.min(100, (item.cantidad / (item.umbralAlerta * 2)) * 100) : 0;

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{item.nombre}</p>
        <p className="text-xs text-muted-foreground">
          Umbral alerta: {formatNumber(item.umbralAlerta, item.umbralAlerta % 1 === 0 ? 0 : 1)} {item.unidad}
        </p>
      </TableCell>
      <TableCell>
        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", cat.tint)}>
          {cat.label}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-mono text-sm font-semibold tabular-nums">
          {formatNumber(item.cantidad, item.cantidad % 1 === 0 ? 0 : 1)} {item.unidad}
        </p>
        <Progress value={pct} className="ml-auto mt-1.5 h-1 w-24" indicatorClassName={meta.bar} />
      </TableCell>
      <TableCell>
        <div className={cn("inline-flex items-center gap-1.5 text-xs font-medium", meta.color)}>
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-mono text-sm tabular-nums">{formatNumber(item.cobertura.ha, 0)} ha</p>
        <p className="text-[10px] text-muted-foreground">{item.cobertura.dosis}</p>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatDateAR(item.ultimaCompra)}
        </p>
      </TableCell>
    </TableRow>
  );
}

export function StockAlerts() {
  const criticos = STOCK_MOCK.filter((i) => {
    const n = nivelStock(i);
    return n === "critico" || n === "agotado";
  });
  if (criticos.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-red-500/15 p-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-200">
            {criticos.length} {criticos.length === 1 ? "producto requiere" : "productos requieren"} reposición urgente
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {criticos.map((c) => (
              <Badge key={c.id} variant="danger" className="text-[10px]">
                {c.nombre}
              </Badge>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
