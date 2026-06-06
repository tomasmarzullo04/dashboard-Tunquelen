import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Tractor,
  Sprout,
  CalendarClock,
} from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/cards/KpiCard";
import { CampaignHero } from "@/components/cards/CampaignHero";
import { LotesMapMini } from "@/components/cards/LotesMapMini";
import { VencimientosList } from "@/components/cards/VencimientosList";
import { LaboresFeed } from "@/components/cards/LaboresFeed";
import { IngresosGastosChart } from "@/components/charts/IngresosGastosChart";
import { SetupBanner } from "@/components/cards/SetupBanner";

import { fetchFacturas } from "@/lib/sheets/facturas";
import { fetchLiquidaciones } from "@/lib/sheets/liquidaciones";
import { fetchLabores } from "@/lib/sheets/labores";
import { memoized } from "@/lib/sheets/cache";
import { computeOverview } from "@/lib/data/overview";
import { formatARS, formatHa, formatNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadOverview() {
  const [facturas, liquidaciones, labores] = await Promise.all([
    memoized("facturas", fetchFacturas),
    memoized("liquidaciones", fetchLiquidaciones),
    memoized("labores", fetchLabores),
  ]);
  return computeOverview({ facturas, liquidaciones, labores });
}

export default async function OverviewPage() {
  let data: Awaited<ReturnType<typeof loadOverview>> | null = null;
  let setupError: string | null = null;

  try {
    data = await loadOverview();
  } catch (err) {
    setupError = err instanceof Error ? err.message : "Error desconocido";
  }

  return (
    <>
      <Topbar
        title="Overview"
        subtitle={data ? `Resumen de ${data.mesActualLabel}` : "Resumen del campo"}
      />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {setupError && <SetupBanner message={setupError} />}

        {/* Hero */}
        <CampaignHero />

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            label="Ingresos del mes"
            value={data ? formatARS(data.kpis.ingresosMes, { compact: true }) : "—"}
            delta={data?.kpis.deltaIngresos}
            icon={TrendingUp}
            accent="primary"
            loading={!data && !setupError}
          />
          <KpiCard
            label="Gastos del mes"
            value={data ? formatARS(data.kpis.gastosMes, { compact: true }) : "—"}
            delta={data?.kpis.deltaGastos}
            icon={Wallet}
            accent="trigo"
            inverse
            loading={!data && !setupError}
          />
          <KpiCard
            label="Resultado del mes"
            value={data ? formatARS(data.kpis.resultadoMes, { compact: true }) : "—"}
            delta={data?.kpis.deltaResultado}
            icon={data && data.kpis.resultadoMes >= 0 ? TrendingUp : TrendingDown}
            accent={data && data.kpis.resultadoMes >= 0 ? "primary" : "danger"}
            loading={!data && !setupError}
          />
          <KpiCard
            label="Hectáreas trabajadas"
            value={data ? formatHa(data.kpis.hectareasMes) : "—"}
            delta={data?.kpis.deltaHectareas}
            icon={Sprout}
            accent="primary"
            loading={!data && !setupError}
          />
          <KpiCard
            label="Labores realizadas"
            value={data ? formatNumber(data.kpis.laboresMes) : "—"}
            delta={data?.kpis.deltaLabores}
            icon={Tractor}
            accent="info"
            loading={!data && !setupError}
          />
          <KpiCard
            label="Próximo vencimiento"
            value={
              data
                ? data.kpis.proximoVencimientoDias != null
                  ? data.kpis.proximoVencimientoDias === 0
                    ? "Hoy"
                    : data.kpis.proximoVencimientoDias === 1
                    ? "Mañana"
                    : `${data.kpis.proximoVencimientoDias} días`
                  : "Sin pendientes"
                : "—"
            }
            hint={data?.kpis.proximoVencimientoProveedor ?? undefined}
            icon={CalendarClock}
            accent={
              data && data.kpis.proximoVencimientoDias != null && data.kpis.proximoVencimientoDias <= 7
                ? "danger"
                : "trigo"
            }
            loading={!data && !setupError}
          />
        </div>

        {/* Grid principal: chart + lotes */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Evolución financiera</CardTitle>
                <CardDescription>Ingresos vs gastos · últimos 12 meses</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-campo-400" />
                  Ingresos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Gastos
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {data ? (
                <IngresosGastosChart data={data.serie12m} />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                  Sin datos
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Plano del campo</CardTitle>
                <CardDescription>Lotes activos · campaña 2026/27</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">4 lotes</Badge>
            </CardHeader>
            <CardContent>
              <LotesMapMini />
            </CardContent>
          </Card>
        </div>

        {/* Vencimientos + Últimas labores */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Próximos vencimientos</CardTitle>
                <CardDescription>Facturas a pagar en los próximos 30 días</CardDescription>
              </div>
              {data && data.vencimientos.length > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Ver todos
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {data ? (
                <VencimientosList items={data.vencimientos} />
              ) : (
                <div className="text-sm text-muted-foreground">Sin datos</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Últimas labores</CardTitle>
                <CardDescription>Actividad reciente en el campo</CardDescription>
              </div>
              {data && data.ultimasLabores.length > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Ver todas
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {data ? (
                <LaboresFeed items={data.ultimasLabores} />
              ) : (
                <div className="text-sm text-muted-foreground">Sin datos</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
