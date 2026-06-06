import { TrendingUp, TrendingDown, Wallet, ShoppingCart, Wheat, CalendarClock } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChartMensual } from "@/components/charts/BarChartMensual";
import { PieGranos } from "@/components/charts/PieGranos";
import { TopProveedoresList } from "@/components/cards/TopProveedoresList";
import { VencimientosList } from "@/components/cards/VencimientosList";
import { SetupBanner } from "@/components/cards/SetupBanner";
import { KpiCard } from "@/components/cards/KpiCard";
import { fetchFacturas } from "@/lib/sheets/facturas";
import { fetchLiquidaciones } from "@/lib/sheets/liquidaciones";
import { memoized } from "@/lib/sheets/cache";
import { computeFinanciero } from "@/lib/data/financiero";
import { formatARS, formatNumber } from "@/lib/utils/format";
import { formatDateAR } from "@/lib/utils/dates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FinancieroPage() {
  let data: ReturnType<typeof computeFinanciero> | null = null;
  let error: string | null = null;
  try {
    const [facturas, liquidaciones] = await Promise.all([
      memoized("facturas", fetchFacturas),
      memoized("liquidaciones", fetchLiquidaciones),
    ]);
    data = computeFinanciero({ facturas, liquidaciones });
  } catch (e) {
    error = e instanceof Error ? e.message : "Error";
  }

  return (
    <>
      <Topbar title="Financiero" subtitle="Análisis y cuenta corriente · últimos 12 meses" />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {error && <SetupBanner message={error} />}

        {/* KPIs anuales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Ingresos 12m"
            value={data ? formatARS(data.totalIngresosAnio, { compact: true }) : "—"}
            icon={TrendingUp}
            accent="primary"
          />
          <KpiCard
            label="Gastos 12m"
            value={data ? formatARS(data.totalGastosAnio, { compact: true }) : "—"}
            icon={Wallet}
            accent="trigo"
          />
          <KpiCard
            label="Resultado 12m"
            value={data ? formatARS(data.resultadoAnio, { compact: true }) : "—"}
            icon={data && data.resultadoAnio >= 0 ? TrendingUp : TrendingDown}
            accent={data && data.resultadoAnio >= 0 ? "primary" : "danger"}
          />
          <KpiCard
            label="Volumen vendido"
            value={data ? `${formatNumber(data.totalVolumen, 1)} tn` : "—"}
            hint={data ? `${data.totalLiquidaciones} liquidaciones` : undefined}
            icon={Wheat}
            accent="info"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
            <TabsTrigger value="granos">Granos</TabsTrigger>
            <TabsTrigger value="vencimientos">Vencimientos</TabsTrigger>
            <TabsTrigger value="cuentacte">Cuenta corriente</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Evolución mensual</CardTitle>
                  <CardDescription>Ingresos vs gastos por mes</CardDescription>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-campo-400" /> Ingresos
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-amber-400" /> Gastos
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {data ? <BarChartMensual data={data.series12m} /> : <div className="h-[300px]" />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proveedores">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top 5 proveedores</CardTitle>
                <CardDescription>Mayor monto facturado en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                {data ? <TopProveedoresList data={data.topProveedores} /> : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="granos">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ventas por grano</CardTitle>
                <CardDescription>Distribución de liquidaciones · 12 meses</CardDescription>
              </CardHeader>
              <CardContent>{data ? <PieGranos data={data.granos} /> : null}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vencimientos">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Próximos vencimientos</CardTitle>
                  <CardDescription>Facturas a pagar en los próximos 60 días</CardDescription>
                </div>
                {data && (
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {data.vencimientos60d.length} pendientes
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {data && <VencimientosList items={data.vencimientos60d} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cuentacte">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Cuenta corriente por proveedor</CardTitle>
                  <CardDescription>Saldo pendiente agrupado</CardDescription>
                </div>
                {data && (
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    Total:{" "}
                    {formatARS(
                      data.cuentaCorriente.reduce((s, c) => s + c.saldoPendiente, 0),
                      { compact: true }
                    )}
                  </span>
                )}
              </CardHeader>
              <CardContent>
                {data && data.cuentaCorriente.length > 0 ? (
                  <div className="rounded-xl border border-border/60 bg-card/30">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Proveedor</TableHead>
                          <TableHead className="text-right">Facturas</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                          <TableHead className="text-right">Próximo vto.</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.cuentaCorriente.map((c) => {
                          const dias = c.proximoVencimiento
                            ? Math.floor((c.proximoVencimiento.getTime() - Date.now()) / 86_400_000)
                            : 999;
                          const variant: "danger" | "warning" | "success" =
                            dias <= 7 ? "danger" : dias <= 15 ? "warning" : "success";
                          return (
                            <TableRow key={c.proveedor}>
                              <TableCell className="font-medium">{c.proveedor}</TableCell>
                              <TableCell className="text-right font-mono tabular-nums">{c.facturasPendientes}</TableCell>
                              <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                                {formatARS(c.saldoPendiente, { compact: c.saldoPendiente >= 1_000_000 })}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                                {formatDateAR(c.proximoVencimiento)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={variant} className="text-[10px]">
                                  {dias <= 0 ? "Hoy" : `${dias} días`}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                    Sin saldo pendiente con vencimientos cargados.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
