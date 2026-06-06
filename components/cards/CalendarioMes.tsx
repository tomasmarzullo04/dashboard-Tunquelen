"use client";

import { useState, useMemo } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, endOfWeek, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EVENTO_CAL_META, type EventoCalendario, eventosDelDia } from "@/lib/data/calendario";
import { formatARS } from "@/lib/utils/format";

interface Props {
  eventos: EventoCalendario[];
}

export function CalendarioMes({ eventos }: Props) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedEvents = eventosDelDia(eventos, selected);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Grid del mes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold capitalize">
            {format(cursor, "MMMM yyyy", { locale: es })}
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setCursor((c) => subMonths(c, 1))} aria-label="Mes anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const t = new Date();
                setCursor(t);
                setSelected(t);
              }}
              className="text-xs"
            >
              Hoy
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Mes siguiente">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cabecera días */}
        <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {["lun", "mar", "mié", "jue", "vie", "sáb", "dom"].map((d) => (
            <div key={d} className="px-2 py-1">{d}</div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const inMonth = isSameMonth(d, cursor);
            const isSel = isSameDay(d, selected);
            const today = isToday(d);
            const dayEvents = eventosDelDia(eventos, d);

            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={cn(
                  "group relative min-h-[64px] rounded-lg border p-1.5 text-left transition-all",
                  "border-border/40 bg-card/30",
                  !inMonth && "opacity-40",
                  isSel && "border-primary/60 bg-primary/5 ring-1 ring-primary/40",
                  !isSel && "hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium tabular-nums",
                      today && "bg-primary text-primary-foreground"
                    )}
                  >
                    {format(d, "d")}
                  </span>
                  {dayEvents.length > 3 && (
                    <span className="font-mono text-[9px] text-muted-foreground">+{dayEvents.length - 3}</span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className={cn("h-1 w-1 rounded-full", EVENTO_CAL_META[e.tipo].dot)}
                      title={e.titulo}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel del día seleccionado */}
      <aside className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-card/30 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {isToday(selected) ? "Hoy" : "Seleccionado"}
          </p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">{format(selected, "d")}</p>
          <p className="text-sm capitalize text-muted-foreground">
            {format(selected, "EEEE 'de' MMMM", { locale: es })}
          </p>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
            Sin eventos programados.
          </div>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((e, i) => {
              const meta = EVENTO_CAL_META[e.tipo];
              return (
                <li
                  key={i}
                  className={cn(
                    "rounded-lg border bg-card/30 p-3 transition-colors hover:bg-card/60",
                    meta.tint.split(" ").filter((c) => c.startsWith("border-")).join(" ")
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{e.titulo}</p>
                        {e.monto != null && (
                          <span className="font-mono text-xs tabular-nums">
                            {formatARS(e.monto, { compact: true })}
                          </span>
                        )}
                      </div>
                      {e.subtitulo && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{e.subtitulo}</p>
                      )}
                      <p className={cn("mt-1 text-[10px] uppercase tracking-wider", meta.tint.split(" ").find((c) => c.startsWith("text-")) ?? "")}>
                        {meta.label}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}
