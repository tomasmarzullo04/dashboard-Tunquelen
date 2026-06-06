import { Wallet } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ComingSoon } from "@/components/cards/ComingSoon";

export default function FinancieroPage() {
  return (
    <>
      <Topbar title="Financiero" subtitle="Ingresos, gastos y cuenta corriente" />
      <main className="p-6 lg:p-8 animate-fade-in">
        <ComingSoon
          icon={Wallet}
          title="Detalle financiero"
          description="Evolución mensual, top proveedores, liquidaciones por grano, vencimientos extendidos y cuenta corriente. Lo construimos en la próxima iteración."
        />
      </main>
    </>
  );
}
