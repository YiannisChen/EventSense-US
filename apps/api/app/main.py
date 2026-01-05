from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="EventSense-US API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AttributionOptions(BaseModel):
    hybrid_retrieval: bool = True
    second_pass: bool = True
    related_entities: bool = False


class RunAttributionRequest(BaseModel):
    ticker: str = Field(..., min_length=1)
    selected_day_et: str = Field(..., description="YYYY-MM-DD (US/Eastern)")
    nl_query: str | None = None
    options: AttributionOptions = Field(default_factory=AttributionOptions)


class RunAttributionResponse(BaseModel):
    run_id: str
    status: Literal["queued", "running", "done", "error"] = "queued"


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/attribution/run", response_model=RunAttributionResponse)
def run_attribution(_: RunAttributionRequest) -> RunAttributionResponse:
    # Stub: backend job queue will be integrated later.
    return RunAttributionResponse(run_id=f"run_{uuid4().hex[:12]}", status="queued")


@app.get("/api/attribution/status")
def attribution_status(run_id: str = Query(...)) -> dict[str, Any]:
    # Stub: always return a deterministic shape.
    return {
        "run_id": run_id,
        "status": "done",
        "current_step": 6,
        "steps": [
            {"id": 1, "label": "ET alignment", "status": "done"},
            {"id": 2, "label": "Initial retrieval", "status": "done"},
            {"id": 3, "label": "Miner → Event IR", "status": "done"},
            {"id": 4, "label": "Critic → Audit checks", "status": "done"},
            {"id": 5, "label": "Second-pass retrieval (≤1) + optional 1-hop", "status": "done"},
            {"id": 6, "label": "Judge → Top causes + Report IR", "status": "done"},
        ],
        "error": None,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/attribution/result")
def attribution_result(run_id: str = Query(...)) -> dict[str, Any]:
    # Stub: minimal shape compatible with the UI placeholders.
    return {
        "run_id": run_id,
        "results": [],
        "evidence_timeline": [],
        "ir": {"event_ir": {}, "report_ir": {}},
    }


@app.get("/api/export/ir")
def export_ir(run_id: str = Query(...)) -> dict[str, Any]:
    return {"run_id": run_id, "ir": {"event_ir": {}, "report_ir": {}}}


@app.get("/api/export/pdf")
def export_pdf(run_id: str = Query(...)) -> dict[str, Any]:
    return {"run_id": run_id, "pdf": {"status": "stub"}}


@app.get("/api/marketdata/ohlcv")
def marketdata_ohlcv(
    ticker: str = Query(...),
    timeframe: str = Query(...),
    start: str = Query(...),
    end: str = Query(...),
) -> dict[str, Any]:
    return {"ticker": ticker, "timeframe": timeframe, "start": start, "end": end, "ohlcv": []}


