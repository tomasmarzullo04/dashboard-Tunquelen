import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoteCard } from "@/components/cards/LoteCard";
import { LotesMapMini } from "@/components/cards/LotesMapMini";
import { SetupBanner } from "@/components/cards/SetupBanner";
import { fetchLabores } from "@/lib/sheets/labores";
import { memoized } from "@/lib/sheets/cache";
import { computeLotesDetalle } from "@/lib/data/lotes-detalle";
import { TOTAL_HECTAREAS, LOTES } from "@/lib/data/lotes";
import { formatHa, formatNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LotesPage() {
  let detalles: ReturnType<typeof computeLotesDetalle> | null = null;
  let error: string | null = null;
  try {
    const labores = await memoized("labores", fetchLabores);
    detalles = computeLotesDetalle(labores);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error";
    detalles = computeLotesDetalle([]);
  }

  const cultivos = Array.from(new Set(LOTES.map((l) => l.cultivoActual)));
  const totalLabores = detalles?.reduce((s, d) => s + d.cantidadLabores, 0) ?? 0;

  return (
    <>
      <Topbar title="Lotes" subtitle={`Campaña 2026/27 · ${LOTES.length} lotes activos`} />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {error && <SetupBanner message={error} />}

        {/* Resumen + Plano */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen de campaña</CardTitle>
              <CardDescription>Visión general de los lotes activos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Superficie total" value={formatHa(TOTAL_HECTAREAS)} accent="primary" />
                <Metric label="Lotes activos" value={String(LOTES.length)} accent="trigo" />
                <Metric label="Labores acumuladas" value={formatNumber(totalLabores)} accent="info" />
                <Metric
                  label="Cultivos"
                  value={String(cultivos.length)}
                  accent="primary"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {cultivos.map((c) => (
                  <Badge key={c} variant="secondary" className="font-normal">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Plano del campo</CardTitle>
              <CardDescription>Layout esquemático · cada parcela proporcional a sus hectáreas</CardDescription>
            </CardHeader>
            <CardContent>
              <LotesMapMini />
            </CardContent>
          </Card>
        </div>

        {/* Tarjetas detalladas por lote */}
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-semibold tracking-tight">Detalle por lote</h2>
            <p className="text-xs text-muted-foreground">Última labor, productos aplicados y avance</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {detalles?.map((d) => (
              <LoteCard key={d.id} detalle={d} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: "primary" | "trigo" | "info" }) {
  const tint = {
    primary: "from-campo-500/15 to-transparent border-campo-500/20",
    trigo: "from-amber-500/15 to-transparent border-amber-500/20",
    info: "from-sky-500/15 to-transparent border-sky-500/20",
  }[accent];
  return (
    <div className={`rounded-lg border bg-gradient-to-br p-3 ${tint}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
