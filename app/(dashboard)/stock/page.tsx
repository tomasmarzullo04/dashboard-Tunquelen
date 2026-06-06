import { Boxes, Droplet, Sprout, Wheat } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/cards/KpiCard";
import { StockTable, StockAlerts } from "@/components/cards/StockTable";
import { STOCK_MOCK, CATEGORIA_META, nivelStock, type ItemStock } from "@/lib/data/stock";
import { formatNumber } from "@/lib/utils/format";

export default function StockPage() {
  const total = STOCK_MOCK.length;
  const ok = STOCK_MOCK.filter((i) => nivelStock(i) === "ok").length;
  const alertas = STOCK_MOCK.filter((i) => {
    const n = nivelStock(i);
    return n === "bajo" || n === "critico" || n === "agotado";
  }).length;

  // Distribución por categoría
  const porCategoria = new Map<ItemStock["categoria"], number>();
  for (const i of STOCK_MOCK) porCategoria.set(i.categoria, (porCategoria.get(i.categoria) ?? 0) + 1);

  return (
    <>
      <Topbar title="Stock de insumos" subtitle="Inventario y alertas por reposición" />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-xs text-violet-200">
          <span className="font-semibold">Demo:</span> stock con datos de muestra. Cuando armes la hoja
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">Stock</code>
          en el spreadsheet lo conectamos a Sheets en 5 minutos.
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Productos" value={String(total)} icon={Boxes} accent="primary" />
          <KpiCard label="Stock OK" value={String(ok)} icon={Sprout} accent="primary" />
          <KpiCard
            label="Requieren atención"
            value={String(alertas)}
            icon={Droplet}
            accent={alertas > 0 ? "danger" : "primary"}
            inverse
          />
          <KpiCard label="Categorías" value={String(porCategoria.size)} icon={Wheat} accent="trigo" />
        </div>

        {/* Alertas */}
        <StockAlerts />

        {/* Distribución por categoría */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución por categoría</CardTitle>
            <CardDescription>Cantidad de productos en cada grupo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(porCategoria.entries()).map(([cat, count]) => {
                const meta = CATEGORIA_META[cat];
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/30 p-3"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.tint}`}>
                      <Boxes className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {meta.label}
                      </p>
                      <p className="font-mono text-lg font-semibold tabular-nums">
                        {formatNumber(count)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventario completo</CardTitle>
            <CardDescription>Ordenado por urgencia de reposición</CardDescription>
          </CardHeader>
          <CardContent>
            <StockTable />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
