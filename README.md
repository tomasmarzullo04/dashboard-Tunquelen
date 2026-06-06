# Dashboard Tunquelen

Panel de gestión del campo Tunquelen — agricultura mixta (≈170 ha) y ganadería (60 cabezas) en el partido de General Pueyrredón, Buenos Aires.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + componentes estilo shadcn/ui
- **Recharts** para visualizaciones
- **Google Sheets API v4** (Service Account) como fuente de datos
- **SWR** para cache cliente con auto-refresh

## Setup

```bash
npm install
cp .env.example .env.local
# Completar GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY y GOOGLE_SPREADSHEET_ID
npm run dev
```

### Service Account

1. En Google Cloud Console crear (o usar) una Service Account.
2. Generar una key en formato JSON.
3. Compartir el spreadsheet con el `client_email` (permiso **Visor** alcanza).
4. Copiar `client_email` y `private_key` al `.env.local` — la key va entre comillas dobles **con los `\n` escapados tal como vienen en el JSON**.

> Si exponés la key en cualquier lado (chat, gist, commit), **rotala** inmediatamente.

## Estructura

```
app/
  (dashboard)/          rutas con sidebar+topbar
    page.tsx            Overview (única sección implementada)
    lotes/ ...          placeholders
  api/sheets/           endpoints JSON por hoja
components/
  ui/                   shadcn-style primitivos
  cards/                KPI cards, mapa de lotes, etc.
  charts/               wrappers de Recharts
  layout/               sidebar, topbar, theme toggle
lib/
  sheets/               cliente + lectores por hoja + cache en memoria
  data/                 reglas de negocio (lotes, cálculo de overview)
  types/                tipos TS por hoja
  utils/                formato AR, fechas, parseo de números
hooks/
  useSheetData.ts       hooks SWR por hoja (cliente)
```

## Estado

- [x] Bootstrap del proyecto
- [x] Cliente Google Sheets + tipos + cache
- [x] Layout (sidebar + topbar + modo oscuro)
- [x] Overview con datos reales
- [ ] Lotes
- [ ] Financiero
- [ ] Labores
- [ ] Ganadería
- [ ] Calendario
- [ ] Stock
