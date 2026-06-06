import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface Props {
  message: string;
}

export function SetupBanner({ message }: Props) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-500/15 p-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-sm font-semibold text-amber-200">
            Faltan credenciales para conectar con Google Sheets
          </p>
          <p className="text-xs text-muted-foreground">
            {message} — Copiá <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">.env.example</code> a{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">.env.local</code> y completá las variables.
          </p>
          <Link
            href="https://developers.google.com/sheets/api/quickstart/nodejs"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300"
          >
            Cómo crear una Service Account
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
