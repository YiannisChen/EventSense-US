## EventSense-US Architecture (Refactor Report)

### What moved where

- Frontend: `web/` → `apps/web/`
- API (stub): `apps/api/`
- Core pipeline placeholders: `packages/core/`
- IR schemas: `packages/schemas/`
- Shared types (placeholder): `packages/shared/`
- Scripts: `scripts/ingest/`, `scripts/eval/`

### How to run

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend (stub):

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Integration points (frontend ↔ backend)

The frontend expects these endpoints (currently stubbed in `apps/api/app/main.py`):

- `POST /api/attribution/run`
- `GET  /api/attribution/status?run_id=...`
- `GET  /api/attribution/result?run_id=...`
- `GET  /api/export/ir?run_id=...`
- `GET  /api/export/pdf?run_id=...`
- `GET  /api/marketdata/ohlcv?ticker=&timeframe=&start=&end=`


