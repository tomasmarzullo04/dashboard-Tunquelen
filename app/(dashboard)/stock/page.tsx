import { Boxes } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function StockPage() {
  return (
    <>
      <Topbar title="Stock de insumos" subtitle="Inventario y umbrales de alerta" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={Boxes}
          title="Inventario de insumos"
          description="Productos en stock, equivalencia en hectáreas y alertas por reposición. Datos a integrar cuando se empiece a cargar."
        />
      </main>
    </>
  );
}
