import { Beef, Baby, Syringe, TrendingUp } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/cards/KpiCard";
import { DonutGanaderia } from "@/components/charts/DonutGanaderia";
import { CalendarioSanitario } from "@/components/cards/CalendarioSanitario";
import { EventosRodeo } from "@/components/cards/EventosRodeo";
import { TOTAL_CABEZAS, RODEO_MOCK, EVENTOS_RECIENTES_MOCK } from "@/lib/data/ganaderia";

export default function GanaderiaPage() {
  const nacimientos30d = EVENTOS_RECIENTES_MOCK.filter(
    (e) => e.tipo === "nacimiento" && e.fecha.getTime() > Date.now() - 30 * 86_400_000
  ).reduce((s, e) => s + e.cantidad, 0);

  const terneros = RODEO_MOCK.find((r) => r.categoria === "terneros")?.cabezas ?? 0;
  const proximaVacunaDias = Math.floor(
    (new Date(Date.now() + 12 * 86_400_000).getTime() - Date.now()) / 86_400_000
  );

  return (
    <>
      <Topbar title="Ganadería" subtitle={`Rodeo Tunquelen · ${TOTAL_CABEZAS} cabezas`} />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {/* Banner de mock data */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-xs text-violet-200">
          <span className="font-semibold">Demo:</span> esta sección usa datos de muestra hasta que se cargue al
          spreadsheet la hoja de ganadería. La estructura está lista para reemplazar.
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total cabezas" value={String(TOTAL_CABEZAS)} icon={Beef} accent="primary" />
          <KpiCard label="Terneros" value={String(terneros)} icon={Baby} accent="trigo" />
          <KpiCard label="Nacimientos 30d" value={String(nacimientos30d)} icon={TrendingUp} accent="primary" />
          <KpiCard
            label="Próxima vacunación"
            value={`${proximaVacunaDias} días`}
            hint="Aftosa · campaña otoñal"
            icon={Syringe}
            accent="info"
          />
        </div>

        {/* Distribución + Calendario sanitario */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Distribución del rodeo</CardTitle>
                <CardDescription>Por categoría · {TOTAL_CABEZAS} cabezas totales</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">Datos demo</Badge>
            </CardHeader>
            <CardContent>
              <DonutGanaderia />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calendario sanitario</CardTitle>
              <CardDescription>Próximas vacunaciones programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarioSanitario />
            </CardContent>
          </Card>
        </div>

        {/* Eventos recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eventos recientes</CardTitle>
            <CardDescription>Nacimientos, ventas, compras y movimientos del rodeo</CardDescription>
          </CardHeader>
          <CardContent>
            <EventosRodeo />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
