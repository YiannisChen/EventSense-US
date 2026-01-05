# EventSense-US

EventSense-US is a “controlled Agentic RAG” system for explaining **why a US stock moved on a specific day** (ex-post attribution). It focuses on **verifiable explanations** with structured IR snapshots.

## Monorepo layout

- `apps/web/`: Vite + React + TypeScript workstation UI
- `apps/api/`: FastAPI backend (stub endpoints for integration)
- `packages/core/`: agentic pipeline placeholders (Miner/Critic/Judge, retrieval, storage)
- `packages/schemas/`: IR JSON Schemas (Event IR / Report IR)
- `packages/shared/`: shared TypeScript contracts/enums (placeholder)
- `scripts/ingest/`: ingest scripts (placeholder)
- `scripts/eval/`: evaluation scripts (placeholder)
- `docs/`: documentation

## Quickstart

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

## Docs

- `docs/ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/API.md`
- `docs/IR_SCHEMA.md`
- `docs/evaluation.md`
