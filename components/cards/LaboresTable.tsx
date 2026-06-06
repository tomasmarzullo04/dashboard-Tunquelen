"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateAR } from "@/lib/utils/dates";
import type { OrdenTrabajo } from "@/lib/types/sheets";

interface Props {
  labores: OrdenTrabajo[];
}

export function LaboresTable({ labores }: Props) {
  const [filter, setFilter] = useState<string>("todos");

  const lotes = useMemo(() => {
    const set = new Set<string>();
    for (const l of labores) if (l.loteOCultivo) set.add(l.loteOCultivo);
    return Array.from(set).sort();
  }, [labores]);

  const filtered = useMemo(() => {
    const sorted = [...labores]
      .filter((l) => l.fecha)
      .sort((a, b) => (b.fecha?.getTime() ?? 0) - (a.fecha?.getTime() ?? 0));
    if (filter === "todos") return sorted;
    return sorted.filter((l) => l.loteOCultivo === filter);
  }, [labores, filter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3 w-3" /> Filtrar por lote:
        </div>
        <button
          onClick={() => setFilter("todos")}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            filter === "todos"
              ? "bg-primary/15 text-foreground font-medium"
              : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
          }`}
        >
          Todos
        </button>
        {lotes.map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`rounded-md px-2 py-1 text-xs transition-colors ${
              filter === l
                ? "bg-primary/15 text-foreground font-medium"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {l}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
          {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Sin labores que coincidan con el filtro.
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card/30">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Fecha</TableHead>
                <TableHead className="w-[70px]">Hora</TableHead>
                <TableHead>Lote / Cultivo</TableHead>
                <TableHead>Insumos</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                    {formatDateAR(l.fecha)}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                    {l.hora || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {l.loteOCultivo || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md text-xs text-foreground/85">
                    <p className="line-clamp-2">{l.insumosResumen || l.insumosDetalle || "—"}</p>
                  </TableCell>
                  <TableCell className="max-w-xs text-xs italic text-muted-foreground">
                    {l.observaciones ? `"${l.observaciones}"` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
