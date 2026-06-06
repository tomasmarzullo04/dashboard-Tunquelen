import { Tractor } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function LaboresPage() {
  return (
    <>
      <Topbar title="Labores agrícolas" subtitle="Cronograma e insumos aplicados" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={Tractor}
          title="Detalle de labores"
          description="Tabla filtrable, heatmap de actividad estilo GitHub, consumo de insumos y comparativa por lote."
        />
      </main>
    </>
  );
}
