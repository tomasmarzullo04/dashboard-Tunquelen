import { NextResponse } from "next/server";
import { fetchLabores } from "@/lib/sheets/labores";
import { memoized } from "@/lib/sheets/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await memoized("labores", fetchLabores);
    return NextResponse.json({ data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
