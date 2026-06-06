import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarioMes } from "@/components/cards/CalendarioMes";
import { SetupBanner } from "@/components/cards/SetupBanner";
import { fetchFacturas } from "@/lib/sheets/facturas";
import { memoized } from "@/lib/sheets/cache";
import { buildEventos, EVENTO_CAL_META } from "@/lib/data/calendario";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CalendarioPage() {
  let eventos: ReturnType<typeof buildEventos> = [];
  let error: string | null = null;

  try {
    const facturas = await memoized("facturas", fetchFacturas);
    eventos = buildEventos(facturas);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error";
    eventos = buildEventos([]);
  }

  const proximos7d = eventos.filter(
    (e) => e.fecha.getTime() <= Date.now() + 7 * 86_400_000 && e.fecha.getTime() >= Date.now() - 86_400_000
  );

  return (
    <>
      <Topbar title="Calendario" subtitle="Vencimientos, vacunaciones, labores y recordatorios" />

      <main className="space-y-6 p-6 lg:p-8 animate-fade-in">
        {error && <SetupBanner message={error} />}

        {/* Leyenda */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tipos de evento</CardTitle>
            <CardDescription>Categorías que se muestran en el calendario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(EVENTO_CAL_META).map(([key, meta]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${meta.tint}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              ))}
              <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                {eventos.length} eventos próximos
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Calendario interactivo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vista mensual</CardTitle>
            <CardDescription>Clickeá un día para ver el detalle</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarioMes eventos={eventos} />
          </CardContent>
        </Card>

        {/* Próximos 7 días */}
        {proximos7d.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Esta semana</CardTitle>
              <CardDescription>{proximos7d.length} eventos en los próximos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2">
                {proximos7d.map((e, i) => {
                  const meta = EVENTO_CAL_META[e.tipo];
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/30 p-3"
                    >
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">{e.titulo}</p>
                          <span className={`text-[10px] font-medium uppercase tracking-wider ${meta.tint.split(" ").find((c) => c.startsWith("text-")) ?? ""}`}>
                            {meta.label}
                          </span>
                        </div>
                        {e.subtitulo && <p className="mt-0.5 text-xs text-muted-foreground">{e.subtitulo}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
