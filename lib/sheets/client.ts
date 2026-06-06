import { google, sheets_v4 } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

let cached: sheets_v4.Sheets | null = null;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno ${name}`);
  return v;
}

export function getSheetsClient(): sheets_v4.Sheets {
  if (cached) return cached;

  const clientEmail = requireEnv("GOOGLE_SHEETS_CLIENT_EMAIL");
  // En Vercel/Next la key viene con \n escapados — los volvemos a saltos reales.
  const privateKey = requireEnv("GOOGLE_SHEETS_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  cached = google.sheets({ version: "v4", auth });
  return cached;
}

export function getSpreadsheetId(): string {
  return requireEnv("GOOGLE_SPREADSHEET_ID");
}

/**
 * Lee un rango completo y devuelve las filas como string[][].
 * Omite el header (primera fila) — devolvelo aparte si lo necesitás.
 */
export async function readRange(rangeA1: string): Promise<{ header: string[]; rows: string[][] }> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: rangeA1,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });
  const values = (res.data.values ?? []) as string[][];
  if (values.length === 0) return { header: [], rows: [] };
  const [header, ...rows] = values;
  return { header, rows };
}
