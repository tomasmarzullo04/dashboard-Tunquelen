"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Wallet,
  Tractor,
  Beef,
  CalendarDays,
  Boxes,
  Wheat,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/lotes", label: "Lotes", icon: Sprout },
  { href: "/financiero", label: "Financiero", icon: Wallet },
  { href: "/labores", label: "Labores", icon: Tractor },
  { href: "/ganaderia", label: "Ganadería", icon: Beef },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/stock", label: "Stock", icon: Boxes },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border/60 bg-card/40 backdrop-blur lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-campo-500 to-campo-700 shadow-md shadow-campo-700/30">
          <Wheat className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">Tunquelen</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Panel de gestión
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="border-t border-border/60 p-4">
        <div className="rounded-lg border border-border/40 bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500/60" />
            <span>Sincronizado</span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
            Campaña 2026/27 · 170 ha
          </p>
        </div>
      </div>
    </aside>
  );
}
