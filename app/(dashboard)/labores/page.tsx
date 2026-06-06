import { Activity, CalendarDays, Tractor } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/cards/KpiCard";
import { LaboresHeatmap } from "@/components/charts/LaboresHeatmap";
import { InsumosBarChart } from "@/components/charts/InsumosBarChart";
import { LaboresTable } from "@/components/cards/LaboresTable";
import { SetupBanner } from "@/components/cards/SetupBanner";
import { fetchLabores } from "@/lib/sheets/labores";
import { memoized } from "@/lib/sheets/cache";
import { computeLaboresStats } from "@/lib/data/labores-stats";
import { formatNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LaboresPage() {
  let stats: ReturnType<typeof computeLaboresStats> | null = null;
  let labores: Awaited<ReturnType<typeof fetchLabores>> = [];
  let error: string | null = null;

  try {
    labores = await memoized("labores", fetchLabores);
    stats = computeLaboresStats(labores);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error";
  }

  return (
    <>
      <Topbar title="Labores agrícolas" subtitle="Heatmap, insumos y registros completos" />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {error && <SetupBanner message={error} />}

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Labores totales"
            value={stats ? formatNumber(stats.total) : "—"}
            icon={Tractor}
            accent="primary"
          />
          <KpiCard
            label="Últimos 30 días"
            value={stats ? formatNumber(stats.totalUltimos30d) : "—"}
            icon={Activity}
            accent="info"
          />
          <KpiCard
            label="Últimos 90 días"
            value={stats ? formatNumber(stats.totalUltimos90d) : "—"}
            icon={CalendarDays}
            accent="trigo"
          />
          <KpiCard
            label="Lotes intervenidos"
            value={stats ? String(stats.porLote.length) : "—"}
            icon={Tractor}
            accent="primary"
          />
        </div>

        {/* Heatmap */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Actividad diaria</CardTitle>
              <CardDescription>Heatmap de labores · últimos 6 meses</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              {stats ? `${stats.totalUltimos90d} en 90d` : "—"}
            </Badge>
          </CardHeader>
          <CardContent>
            {stats ? (
              <LaboresHeatmap cells={stats.heatmap} />
            ) : (
              <div className="h-[120px]" />
            )}
          </CardContent>
        </Card>

        {/* Insumos + por lote */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Insumos más aplicados</CardTitle>
              <CardDescription>Acumulado de productos detectados · 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && <InsumosBarChart data={stats.topInsumos} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución por lote</CardTitle>
              <CardDescription>Cantidad de labores registradas</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && stats.porLote.length > 0 ? (
                <ul className="space-y-2">
                  {stats.porLote.map((p) => {
                    const max = stats!.porLote[0].cantidad;
                    const pct = max > 0 ? (p.cantidad / max) * 100 : 0;
                    return (
                      <li key={p.lote} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{p.lote}</span>
                          <span className="font-mono tabular-nums">{p.cantidad}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-campo-700 to-campo-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos suficientes.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabla cronológica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registro de labores</CardTitle>
            <CardDescription>Cronología completa · filtrable por lote</CardDescription>
          </CardHeader>
          <CardContent>
            <LaboresTable labores={labores} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
