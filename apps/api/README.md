## EventSense-US API (stub)

This is a minimal FastAPI skeleton to support frontend ↔ backend integration later.

### Run

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Endpoints (stub)

- `POST /api/attribution/run`
- `GET  /api/attribution/status?run_id=...`
- `GET  /api/attribution/result?run_id=...`
- `GET  /api/export/ir?run_id=...`
- `GET  /api/export/pdf?run_id=...`
- `GET  /api/marketdata/ohlcv?ticker=&timeframe=&start=&end=`


