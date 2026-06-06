import { CalendarDays } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function CalendarioPage() {
  return (
    <>
      <Topbar title="Calendario" subtitle="Próximas tareas y eventos" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={CalendarDays}
          title="Vista de calendario"
          description="Mes con vencimientos, vacunaciones, labores planificadas y recordatorios personalizados."
        />
      </main>
    </>
  );
}
