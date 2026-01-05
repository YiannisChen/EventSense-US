# EventSense‑US — Product Requirements Document

> Evidence‑driven, macro‑aware retrieval‑augmented system for **event attribution** in **US equities**. This PRD keeps **what/why** and explicit **mechanisms**, and defers parameters, formulas, model IDs, and pseudocode to the TSD.

---

## 0) Executive Summary

**Problem.** Analysts need **verifiable explanations** for a stock's movement within a chosen period. Existing tools emphasize sentiment or headlines, not **grounded events with citations**.

**Solution.** Search only **whitelisted sources** (regulatory portals, issuer investor‑relations/press, tier‑1 financial media). Extract **structured events** with citations, then rank **up to three distinct** causes using an **explainable, non‑circular** method combining: time alignment, source authority, specificity/novelty, independent confirmation, scope, numeric materiality (size vs company scale), and expectation surprise (vs prior guidance/credible consensus). The system is **macro‑aware** so macro/industry items can outrank firm items when appropriate. Wording is **assertive** when evidence is strong; otherwise it returns a **cautious/refusal** block with a **missing‑evidence checklist**.

**Scope.** US equities · text only · last **90 days** · all timestamps normalized to **US Eastern Time (ET)** with session labels (pre‑market / regular / after‑hours).

**Non‑goals.** No trading signals/automation; no social feeds; no on‑chain data; no mirroring paywalled bodies (metadata + link only).

---

## 1) Users & Key Use Cases

**Users.** Equity researchers/PMs; risk/product reviewers; instructors/graduate students.

**Natural‑language input** (no technical strings):

* "nvda today" · "what events led to the nvda pump yesterday" · "nvda earnings day" · "tsla last week big drop".

**Automatic interpretation (deterministic, user‑friendly).**

* "today" → current session in ET (pre/regular/after‑hours auto‑detected).
* "yesterday/last session" → previous regular session.
* "earnings day" → the calendar day plus one adjacent session (to cover pre/after‑hours disclosures).
* "big pump/drop" → auto‑focus on the most notable recent session.
* Experts can specify exact start/end in **Advanced**; typical users do not type timestamps.

**Macro overlay (always‑on).** Overlay a calendar of macro/industry events (e.g., rate decisions, key economic prints, major sector briefings). Overlaps become **first‑class** candidates and can rank #1.

**User stories & acceptance.**

* **US‑1 Researcher query.** Input plain text → single screen with **up to three** distinct event cards; each card includes **2–4 citations**, a concise explanation, and a **window comparison** visual.
* **US‑2 Macro‑dominant day.** If macro aligns strongly with the window → show **Macro‑dominant** tag; wording remains assertive when evidence is strong.
* **US‑3 Conflicting/weak evidence.** Show **cautious/refusal** card and a **missing‑evidence checklist** (e.g., "need official filing or two independent tier‑1 confirmations").

---

## 2) Product Scope 

**Must.** Plain‑language input; optional date picker; **Advanced** explicit window; **up to 3** distinct event cards; ≥2 citations/card (snippet+link); **window comparison** visual; **macro‑dominant** label; **cautious/refusal** with checklist; **JSON/PDF export**; **Sources & Versions** summary.

**Should.** Curated sample library (positive/macro‑dominant/conflict); simple evaluation page (baseline vs hybrid retrieval charts).

**Could.** Minimal notifications (opt‑in); bilingual UI; sector‑specific templates.

**Won't (now).** Automated trading; social/on‑chain data; mirroring paywalled text.

---

## 3) Working Mechanism 

### A) Offline / Periodic (no LLM)

1. **Fetch (whitelist).** Regulatory portals, issuer IR/press, tier‑1 financial media (text only). Persist essential metadata (URL, title, raw time, source type, ticker hints).
2. **Normalize & Chunk.** Convert times to **ET**; label session; clean HTML; split into overlapping textual chunks with metadata (doc/chunk IDs, URL, ET timestamp, source type, candidate tickers).
3. **Dual Index.** Build a **keyword index** and a **semantic/vector index** to support hybrid retrieval.
4. **Macro/Industry calendar.** Maintain authoritative entries with precise **ET** timestamps and links (e.g., rate decisions, key economic releases, sector hearings).
5. **Company baseline scale (for materiality).** From the latest public filings (e.g., annual/quarterly reports) record a scale such as trailing revenue for each ticker.

### B) User‑Active / Online (LLM only where valuable)

1. **Parse input → infer ticker + time window.** Apply ticker/time filters early to reduce noise.
2. **Optional light rewrite.** Normalize slang/aliases while **keeping the original query path** to avoid over‑normalization.
3. **Retrieval (switchable for evaluation).**

   * **Baseline:** keyword‑only retrieval.
   * **Hybrid:** combine keyword with semantic retrieval and merge/deduplicate candidates.
   * **Hybrid+Rerank:** optional lightweight reranking on the top candidates.
4. **Structured extraction (LLM).** For each candidate, extract a **structured event record** with fields such as: event type, actor, ET time, direction, key numbers (if any), citations (snippet + link + source type). Missing fields remain empty; quotes are **minimal but sufficient**; links must work.
5. **Distinctness (cluster duplicates).** Articles about the **same fact** within a **small time tolerance** are clustered into **one event**. A card aggregates **2–4 citations** prioritized by **authority** and **independence**.
6. **Numeric materiality.** Convert reported numbers (e.g., contract values, guidance/revenue/EPS changes) into a **qualitative materiality tier** relative to the company's baseline scale (e.g., small / moderate / large). Framework/"up to" language, undisclosed counterparties, and non‑binding statements reduce the tier.
7. **Expectation surprise.** Where credible expectations exist (preferably prior guidance; otherwise well‑sourced consensus), compute a **directional surprise** (above/in‑line/below). If no credible baseline exists, this factor is omitted.
8. **Explainable ranking.** Combine the following **pillars** into an overall influence estimate: **time alignment, source authority, specificity/novelty, independent confirmation, scope, numeric materiality, expectation surprise**, minus any **penalties** (e.g., rumor, after‑window only, poor citations). Exact calibration is defined in the TSD. Ties are resolved by time alignment → authority → specificity → earlier time → a deterministic key. **No price‑based peeking** is used to score influence; price only defines the window.
9. **Compose & present (LLM).** Render **up to three** highest‑scoring **distinct** events. Each card shows concise bullets with inline links, a **Materiality** chip, and a **Why it ranks** line derived from the pillars. If evidence is weak/contradictory → show **cautious/refusal** with a checklist. Include a **window comparison** visual and **JSON/PDF export**; show a concise **Sources & Versions** summary.
10. **Logging for evaluation.** Persist run metadata sufficient for the evaluation harness (details in TSD).

---

## 4) Ranking & Influence

**Principles.**

* **Time alignment**: events inside or reasonably preceding the window rank higher than those clearly after it.
* **Authority & confirmation**: regulatory/issuer sources outrank media; independent confirmations strengthen ranking.
* **Specificity & novelty**: **new, quantified** facts outrank vague recaps or opinions.
* **Scope**: macro/industry items can legitimately outrank firm items when expected reach is broader.
* **Numeric materiality**: numbers are interpreted **relative to company scale** from filings and bucketed into qualitative tiers (e.g., small/moderate/large). Larger, binding, named‑counterparty items rank above tiny or ambiguous amounts.
* **Expectation surprise**: above/inline/below relative to a credible baseline (prefer prior guidance). Negative surprises reduce ranking and inform tone.
* **Penalties**: rumor/unconfirmed, after‑window only, or citation‑poor candidates are down‑weighted or refused.

**Distinctness & aggregation.** One card per **distinct** event; media rewrites collapse into a single cluster with 2–4 best citations. If fewer than three distinct events meet the evidence bar, show fewer; never fabricate filler.

**Card reasons.** Each card prints a succinct "**Why it ranks**" line exposing the pillars (e.g., "in‑window; issuer + filing; new quantified guidance; independently confirmed; materiality: large").

---

## 5) Data & Compliance

* **Whitelist only**: regulatory/official sources and tier‑1 financial media; public, quotable content. Paywalled bodies are not mirrored—store metadata + outbound link.
* **ET normalization** for all timestamps; clear session labels.
* **Deduplication policy** to avoid duplicate facts in UI.
* **Disclaimer**: not investment advice; comply with robots/copyright.

---

## 6) Functional Requirements (what, not how)

* **FR‑1 Input.** Single plain‑language box; optional date picker; **Advanced** explicit window; ET labels.
* **FR‑2 Retrieval.** Provide **switchable retrieval modes** (baseline/hybrid/hybrid+rerank) and return an **explainable candidate set**.
* **FR‑3 Extraction.** Produce a **structured event record** (type, actor, ET time, direction, key numbers, citations).
* **FR‑4 Ranking.** Rank with an **explainable combination** of pillars; show a **Why it ranks** reason per card.
* **FR‑5 Macro awareness.** Overlay macro/industry calendar; macro items can rank #1 when they fit better.
* **FR‑6 Language policy.** Assertive when evidence is strong; cautious/refusal with a **missing‑evidence checklist** when weak/contradictory.
* **FR‑7 Visualization & export.** Window comparison visual; **JSON/PDF export**.
* **FR‑8 Traceability.** Compact **Sources & Versions** summary on results.

---

## 7) Non‑Functional Requirements

* **Performance.** Minute‑level end‑to‑end responsiveness for typical queries (actuals recorded; details in TSD).
* **Reliability.** Clear states: Loading / Success / Empty / Degraded / Error; resilient to partial source outages.
* **Security & compliance.** Public text or metadata+links only; non‑advice disclaimer.
* **Observability.** Basic traceability/diagnostics for reproduction and defense (details in TSD).
* **Accessibility.** Responsive layout; keyboard‑reachable; sufficient contrast.

---

## 8) Evaluation — Research‑Style (LLM fixed for fairness)

**Rationale.** Fix a single generation model to isolate retrieval effects on attribution.

**Comparative setups.**

* **E1 — Keyword‑only baseline**
* **E2 — Hybrid retrieval** (keyword + semantic, late fusion)
* **E3 — Hybrid with reranking** (light reranking on top candidates)

**Dataset (gold).** A set of labeled windows across large‑cap tickers, mixing firm‑driven, macro‑dominant, and conflicting cases. Each sample includes a one‑line teaching answer and 1–2 authoritative links.

**Metrics (descriptive; report relative improvements).**

* **Main‑cause@Top‑3** (is the gold cause in the top cards?)
* **Extraction completeness** (mandatory event fields present)
* **Citation correctness** (quotes/links actually support claims)
* **Latency** (end‑to‑end; descriptive only)
* **Stability** (small window shifts or temporary source removal should not flip the main cause)
* **Refusal quality** (ambiguous/conflicting cases → useful refusal with checklist)

**Reporting.** Show E2 vs E1 and E3 vs E2 relative lifts with simple confidence cues; include a **failure‑case library** (recall gap, time mis‑fit, weak source, missing fields).

---

## 9) UX / UI Overview (page‑level)

**Search page.** Input → results overview (up to three cards) → explanation panel (bullets with inline citations) → **window comparison** visual → export. Empty slots are not shown; instead, a note: "Only **N** distinct event(s) met the evidence bar."

**Samples page.** Curated positive / macro‑dominant / conflicting cases for demos and defense.

**Evaluation page.** Comparative charts of baseline vs hybrid retrieval (no algorithm internals).

**Tone.** Neutral, factual; **assertive** when pillars align; **cautious/refusal** when not.

**States.** Loading / Success / Empty / Degraded / Error. Accessible & responsive.

---

## 10) Risks & Mitigations

| Risk                     | Impact                   | Mitigation                                                         |
| ------------------------ | ------------------------ | ------------------------------------------------------------------ |
| Multiple same‑day events | Ambiguous main cause     | Show **up to three** with **Why it ranks**; encourage human review |
| Copyright/licensing      | Cannot show body         | Keep **metadata + link**; open source in new tab                   |
| Time alignment errors    | Mis‑attribution          | Normalize to **ET**; session labels; highlight edge cases          |
| Macro co‑movement        | Over‑attribution to firm | Macro competes equally; can rank #1                                |
| Duplicate media coverage | UI clutter               | **Cluster** rewrites; aggregate citations into one card            |

---

## 11) Glossary

* **Ticker (stock symbol)**: short company code (e.g., NVDA, AAPL, TSLA).
* **ET alignment**: convert all timestamps to US Eastern Time and label sessions so firm and macro events line up.
* **Keyword‑based retrieval**: matches literal terms; good precision for named facts.
* **Semantic retrieval**: uses meaning‑aware representations to match paraphrases/context.
* **Hybrid retrieval**: combines keyword and semantic retrieval, then fuses results (optionally reranked).
* **RAG (retrieve‑then‑generate)**: retrieve grounded texts first; then generate **structured, cited** output.
* **Structured event record**: a normalized event with type, actor, ET time, direction, key numbers, citations.
* **Macro‑dominant day**: a period where macro plausibly outweighs firm‑level effects.
* **Window comparison**: a simple visual showing magnitude before/after the window (no prediction).

---

> **Note to TSD**: Put here the exact schemas, constants, time tolerances, reranking models, generation temperature, ranking calibration, materiality and surprise calculations, logging fields, batch runner, and CI harness. This separation keeps the PRD stable and product‑focused while enabling iterative engineering tuning in the TSD.
