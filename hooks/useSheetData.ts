"use client";

import useSWR from "swr";
import type { Factura, Remito, LiquidacionGrano, OrdenTrabajo } from "@/lib/types/sheets";
import { parseSheetDate } from "@/lib/utils/dates";

const REFRESH_MS = 5 * 60 * 1000;

async function fetcher<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Error ${res.status}`);
  }
  const { data } = (await res.json()) as { data: T[] };
  return data;
}

// El cliente recibe fechas como strings (JSON). Las re-hidratamos a Date.
function rehydrateDates<T>(rows: T[], dateKeys: (keyof T)[]): T[] {
  return rows.map((row) => {
    const copy = { ...row };
    for (const k of dateKeys) {
      const v = copy[k] as unknown as string | null;
      copy[k] = (v ? parseSheetDate(v) : null) as T[keyof T];
    }
    return copy;
  });
}

const swrOptions = {
  refreshInterval: REFRESH_MS,
  revalidateOnFocus: false,
  dedupingInterval: 30_000,
};

export function useFacturas() {
  const { data, error, isLoading, mutate } = useSWR<Factura[]>(
    "/api/sheets/facturas",
    fetcher,
    swrOptions
  );
  return {
    data: data ? rehydrateDates(data, ["fechaEmision", "fechaVencimiento"]) : undefined,
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useRemitos() {
  const { data, error, isLoading, mutate } = useSWR<Remito[]>(
    "/api/sheets/remitos",
    fetcher,
    swrOptions
  );
  return {
    data: data ? rehydrateDates(data, ["fecha"]) : undefined,
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useLiquidaciones() {
  const { data, error, isLoading, mutate } = useSWR<LiquidacionGrano[]>(
    "/api/sheets/liquidaciones",
    fetcher,
    swrOptions
  );
  return {
    data: data ? rehydrateDates(data, ["fecha"]) : undefined,
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useLabores() {
  const { data, error, isLoading, mutate } = useSWR<OrdenTrabajo[]>(
    "/api/sheets/labores",
    fetcher,
    swrOptions
  );
  return {
    data: data ? rehydrateDates(data, ["fecha"]) : undefined,
    error,
    isLoading,
    refresh: mutate,
  };
}
