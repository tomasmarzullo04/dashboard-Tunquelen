import { Beef } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function GanaderiaPage() {
  return (
    <>
      <Topbar title="Ganadería" subtitle="60 cabezas · rodeo Tunquelen" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={Beef}
          title="Vista de rodeo"
          description="Cabezas totales, distribución por categoría, calendario sanitario y eventos recientes. La estructura está lista para cuando empieces a cargar datos."
        />
      </main>
    </>
  );
}
