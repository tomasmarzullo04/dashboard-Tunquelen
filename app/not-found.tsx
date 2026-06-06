import Link from "next/link";
import { Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 gradient-mesh px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-campo-500 to-campo-700 shadow-lg shadow-campo-700/30">
        <Wheat className="h-7 w-7 text-white" />
      </div>
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Acá no hay nada sembrado.</h1>
        <p className="text-sm text-muted-foreground">
          La página que buscás no existe.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Volver al overview</Link>
      </Button>
    </div>
  );
}
