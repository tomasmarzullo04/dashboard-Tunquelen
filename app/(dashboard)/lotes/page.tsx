import { Sprout } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function LotesPage() {
  return (
    <>
      <Topbar title="Lotes" subtitle="Estado por lote · campaña 2026/27" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={Sprout}
          title="Vista detallada de lotes"
          description="Tarjetas grandes por lote con cultivo, estado, última labor, total aplicado y timeline. Lo armamos después de aprobar el Overview."
        />
      </main>
    </>
  );
}
