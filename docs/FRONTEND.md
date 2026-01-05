## EventSense-US Frontend (apps/web)

### Overview

EventSense-US is a “Price Move Attribution (Ex-post)” workstation UI for US stocks:

- User selects **ticker + single day (ET)** (optionally adds a natural-language query)
- Clicks **Run Attribution**
- Views **Results / Evidence / IR** and exports artifacts

This frontend is a **Vite + React** app under `apps/web/`.

### Architecture / Information Architecture

- **TopNav** (`apps/web/src/components/TopNav.tsx`)
  - Brand (left)
  - Ticker autocomplete (center)
  - Profile pill linking to X (right)
- **Top workstation section** (`apps/web/src/App.tsx`)
  - `PriceChart` (left)
  - `AttributionPanel` (right)
  - Desktop: equal-height columns with clamped height; panel can scroll internally
- **SectionBar** (`apps/web/src/components/SectionBar.tsx`)
  - Tabs: Results / Evidence / IR
  - Exports: Export PDF (always), Export IR (IR tab only)
- **Content section**
  - Left: active tab content
  - Right: Run Status stepper

### State model (owned in `apps/web/src/App.tsx`)

- `activeTab`: `"Results" | "Evidence" | "IR"`
- `ticker`: string (TopNav + panel share the same value)
- `selectedDayET`: `YYYY-MM-DD`
- `nlQuery`: string
- `options`:
  - `hybridRetrieval: boolean`
  - `secondPass: boolean`
  - `relatedEntities: boolean`
- `isRunning`: boolean (UI demo timer for the stepper + skeleton)

### Styling system (Plan A)

We do not assume Tailwind utilities exist at runtime. Styling is driven by:

- `apps/web/src/styles/tokens.css` (Uniswap-like grayscale + magenta accent `rgb(239, 3, 172)`)
- `es-*` utility classes for layout primitives and components

Accent usage rules:

- Use accent magenta for **primary actions**, **active tabs**, and **focus rings** only.

### Demo chart mode (temporary)

Price chart can be swapped between demo image and real chart code path:

- Demo image: `apps/web/public/demo_pic.png`
- Flag: `VITE_USE_DEMO_CHART`
  - Default behavior: demo is ON unless `VITE_USE_DEMO_CHART=false`

Example:

```bash
cd apps/web
VITE_USE_DEMO_CHART=false npm run dev
```

### Running / building

```bash
cd apps/web
npm install
npm run dev
npm run build
```

### Backend integration contract (proposed)

These endpoints do not exist yet; they represent the integration surface the UI expects.

#### 1) Run attribution

`POST /api/attribution/run`

Request:

```json
{
  "ticker": "NVDA",
  "selected_day_et": "2026-01-15",
  "nl_query": "Why did NVDA drop on Jan 15, 2026?",
  "options": {
    "hybrid_retrieval": true,
    "second_pass": true,
    "related_entities": false
  }
}
```

Response:

```json
{
  "run_id": "run_20260115_nvda_001",
  "status": "queued"
}
```

#### 2) Status / progress

`GET /api/attribution/status?run_id=...`

Response:

```json
{
  "run_id": "run_20260115_nvda_001",
  "status": "running",
  "current_step": 3,
  "steps": [
    {"id": 1, "label": "ET alignment", "status": "done"},
    {"id": 2, "label": "Initial retrieval", "status": "done"},
    {"id": 3, "label": "Miner → Event IR", "status": "running"}
  ],
  "error": null
}
```

#### 3) Result payload

`GET /api/attribution/result?run_id=...`

Response:

```json
{
  "run_id": "run_20260115_nvda_001",
  "results": [
    {
      "rank": 1,
      "headline": "…",
      "evidence": ["…"],
      "why_ranks": ["Time Proximity", "High Authority"],
      "citations": [{"domain": "sec.gov", "time": "16:05 ET", "type": "SEC"}]
    }
  ],
  "evidence_timeline": [
    {"type": "SEC", "title": "…", "date": "2026-01-15", "time": "16:05 ET", "source": "sec.gov"}
  ],
  "ir": {
    "event_ir": { "…": "…" },
    "report_ir": { "…": "…" }
  }
}
```

#### 4) Exports

- `GET /api/export/pdf?run_id=...`
- `GET /api/export/ir?run_id=...`

### Future: swapping demo chart to real candles

When backend integration is ready, chart data can come from:

- backend-provided OHLCV for the selected day (preferred)
- or a market-data provider behind the backend (avoid exposing provider keys to frontend)


