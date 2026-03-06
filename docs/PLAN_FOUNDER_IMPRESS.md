# Plan: Founder-Impressing Deliverables (Multi-Agent)

**Goal**: Implement the four founder-focused items so the project clearly answers “Would we use this? Can we quote one number? Is there evidence? Does it protect our reputation?”

**Deliverables**:
1. **Founder one-pager** — Single artifact (2–3 slides or 1 page) to send first: what we measure, one headline per platform, one benchmark table.
2. **Homepage use cases** — Explicit “Use this to: (1) Show investors… (2) Spot unhealthy markets… (3) Compare to Kalshi/Polymarket.”
3. **Market health score (0–100)** — One number per market (or per market-day), documented in METHODOLOGY, exposed in API + UI.
4. **One benchmark report** — Short dated report “Pred vs Kash vs Kalshi – Q1 2025” (or example period) with 3–5 charts and narrative; forwardable.

---

## Phase 0 — Shared context (no agent)

- **Schema**: `market_daily_aggregates` has `avg_spread`, `median_spread`, `max_depth_bid_5`, `max_depth_ask_5`, `total_volume`, `unique_traders`, `gini_participation`. Use these for health score.
- **Existing**: METHODOLOGY.md (spread, depth, Gini); example founder deck (Marp); benchmarks API and page; homepage “What it does” and “Who it’s for.”
- **Stack**: Next.js App Router, Supabase/Postgres, Bun. Dashboard in `apps/dashboard/`.

---

## Phase 1 — Market health score (backend + methodology + API + UI)

**Owner**: Backend + doc agent then frontend agent.

### 1.1 Formula and persistence

- **Agent**: `backend-architect` or `generalPurpose`
- **Task**: Define market health score 0–100 from existing daily aggregate fields.
  - **Formula (example)**: Normalize each component to 0–1 then weight: e.g. spread score = 1 − percentile(avg_spread), depth score = percentile(max_depth_bid_5 + max_depth_ask_5), volume score = percentile(total_volume), participation score = 1 − gini_participation. Weights: e.g. 30% spread, 25% depth, 25% volume, 20% participation. Document that percentiles are computed **per platform and date** (or global) so the score is comparable.
- **Outputs**:
  - New column `health_score numeric` on `market_daily_aggregates` (migration in `supabase/migrations/`), **or** computed in API only (no migration). If computed in API: add a short note in migration or a comment that health_score is derived in application layer.
  - If stored: analytics job or SQL that backfills/updates `health_score` from the same table’s other columns (percentiles per platform/date).
- **Acceptance**: METHODOLOGY.md has a “Market health score” section (formula, weights, interpretation). If DB: migration applied and backfill script/job described.

### 1.2 Methodology section

- **Agent**: `doc-updater`
- **Task**: Add “Market health score” to `docs/METHODOLOGY.md`: definition (0–100), formula (components and weights), interpretation (e.g. 80+ = strong liquidity, &lt;40 = thin/concentrated), and that it’s traceable to `market_daily_aggregates`.
- **Acceptance**: A founder can answer “How is the health score computed?” from METHODOLOGY.md.

### 1.3 API

- **Agent**: `backend-architect` or `generalPurpose`
- **Task**: Expose health score in API:
  - `GET /api/markets/[id]`: include `health_score` (latest day or latest snapshot) in response.
  - `GET /api/markets`: optional query `?sort=health_score` and include `health_score` in list items when requested.
  - If computed in API (no column): compute from `market_daily_aggregates` for the market’s latest date (and optionally cache).
- **Acceptance**: Both routes return health_score; docs/API.md updated.

### 1.4 Dashboard UI

- **Agent**: `frontend-developer`
- **Task**: Show health score in dashboard: market list (column or badge), market detail (prominent number 0–100 with short label “Market health”). Reuse existing design system.
- **Acceptance**: User sees health score on markets list and market detail without breaking existing layout.

---

## Phase 2 — Homepage use cases and positioning

**Owner**: Frontend agent.

### 2.1 “Use this to” section

- **Agent**: `frontend-developer`
- **Task**: On homepage (`apps/dashboard/src/app/page.tsx`), add a clear “Use this to” (or “Why founders use this”) section with three bullets:
  1. **Show investors your liquidity vs incumbents** — Benchmarks and exportable charts.
  2. **Spot unhealthy or whale-dominated markets** — Health score, Gini, top wallets.
  3. **Compare your spreads and depth to Kalshi and Polymarket** — Benchmark view and methodology.
- Place it near “What it does” or “Who it’s for” so founders see it above the fold or early in scroll.
- **Acceptance**: Homepage explicitly names these three use cases in one place.

### 2.2 Optional: hero subline

- **Agent**: `frontend-developer`
- **Task**: Optionally add one line under the hero subtitle: e.g. “Use it to show investors liquidity, spot whale-dominated markets, and compare to Kalshi and Polymarket.” Can be the same three points in one sentence.
- **Acceptance**: Hero reinforces the same message (optional).

---

## Phase 3 — Founder one-pager (artifact)

**Owner**: Docs agent.

### 3.1 One-pager content

- **Agent**: `docs-architect` or `doc-updater`
- **Task**: Create a single founder-facing artifact: **one-pager** (1 page) or **short deck** (2–3 slides).
  - **Content**: (1) Title: Liquidity Intelligence – what we measure. (2) One headline per platform (Pred, Kash, Kalshi, Polymarket): e.g. one metric or one sentence each. (3) One benchmark table (volume, active markets, avg spread) for a chosen period. (4) “Use this to” three bullets (same as homepage). (5) Optional: “Market health score” one-liner and link to METHODOLOGY.
  - **Format**: Markdown in `docs/consulting/founder-one-pager.md` (and optionally Marp slides in `docs/consulting/founder-one-pager-deck.md`). Use existing `docs/consulting/example-founder-deck.md` style (traceability, source tables).
- **Acceptance**: One file (or two) that a founder can open and in 30 seconds see: what we measure, how each platform looks, and why to use it. No code changes.

---

## Phase 4 — Benchmark report (dated, forwardable)

**Owner**: Docs agent (and optionally frontend for “Report” page).

### 4.1 Report document

- **Agent**: `docs-architect` or `doc-updater`
- **Task**: Create one short **benchmark report**: “Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation” for a specific period (e.g. Q1 2025 or “Example period”).
  - **Sections**: (1) Title and date range. (2) Methodology in 2–3 sentences + link to METHODOLOGY.md. (3) 3–5 charts or tables: e.g. total volume by platform, active markets, avg spread, optional health score distribution, optional Gini. (4) Short narrative: “Pred is strong on X, Kash on Y” with evidence from the tables. (5) Caveats (data freshness, incumbent data source).
  - **Location**: `docs/reports/2025-Q1-benchmark.md` (or `docs/reports/example-benchmark-report.md` if no real data). Use data from existing benchmark API or export; if no live data, use placeholders and label “Example”.
- **Acceptance**: One report file that can be shared or attached; every chart/table cites source (table + date range).

### 4.2 Optional: Reports index and link from app

- **Agent**: `frontend-developer`
- **Task**: Add a “Reports” link in header or footer; target a page that lists reports (e.g. link to `docs/reports/` or a simple `/reports` page that renders the report list and links to the benchmark report).
- **Acceptance**: User can reach the benchmark report from the app (optional).

---

## Phase 5 — API and doc updates (consistency)

**Owner**: Doc-updater or api-documenter.

### 5.1 API.md and OpenAPI

- **Agent**: `doc-updater` or `api-documenter`
- **Task**: Update `docs/API.md` and `docs/openapi.yaml` (if present) with: `GET /api/markets` and `GET /api/markets/[id]` response shapes including `health_score`; any new query params (e.g. `sort=health_score`).
- **Acceptance**: API docs match implementation; health score is documented.

---

## Agent summary (who does what)

| Phase | Primary agent(s) | Deliverable |
|-------|-------------------|-------------|
| 1.1   | backend-architect / generalPurpose | Health score formula, migration or computed spec, METHODOLOGY section (or handoff to doc-updater) |
| 1.2   | doc-updater       | METHODOLOGY.md “Market health score” section |
| 1.3   | backend-architect / generalPurpose | API routes returning health_score |
| 1.4   | frontend-developer | Dashboard: health score in list + detail |
| 2.1–2.2 | frontend-developer | Homepage “Use this to” + optional hero line |
| 3.1   | docs-architect / doc-updater | Founder one-pager (and optional 2–3 slide deck) |
| 4.1   | docs-architect / doc-updater | Benchmark report (e.g. 2025-Q1 or example) |
| 4.2   | frontend-developer | Optional Reports link and page |
| 5.1   | doc-updater / api-documenter | API.md + OpenAPI updated for health_score |

---

## Execution order and dependencies

```
Phase 1.1 (formula + migration/compute) ──┬── Phase 1.2 (METHODOLOGY)
                                          ├── Phase 1.3 (API)
                                          └── Phase 1.4 (UI) [depends on 1.3]
Phase 2.1–2.2 (homepage) ────────────────── no dependency
Phase 3.1 (one-pager) ───────────────────── can use METHODOLOGY + benchmark table from existing app
Phase 4.1 (benchmark report) ────────────── can use existing benchmarks API + METHODOLOGY
Phase 4.2 (reports page) ─────────────────── depends on 4.1
Phase 5.1 (API docs) ─────────────────────── after 1.3
```

**Recommended parallelization**:
- **Stream A**: Phase 1.1 → 1.2 + 1.3 (then 1.4, then 5.1).
- **Stream B**: Phase 2.1–2.2 (any time).
- **Stream C**: Phase 3.1 and 4.1 in parallel after METHODOLOGY has health score (or in parallel with 1.2 if formula is agreed in 1.1).

---

## Prompts for each agent (copy-paste)

### Backend (health score formula + API)

```
You are working on the Liquidity Intelligence Console (Next.js, Supabase). Add a market health score 0–100.

Context:
- Table market_daily_aggregates has: market_id, platform_id, date, total_volume, num_trades, avg_spread, median_spread, max_depth_bid_5, max_depth_ask_5, unique_traders, gini_participation.
- We want one number per market per day: 0 = poor liquidity/concentration, 100 = strong, even participation.

Tasks:
1) Propose a formula: normalize spread (lower is better), depth (higher better), volume (higher better), participation (1 - gini, higher better). Use percentiles per (platform_id, date) so scores are comparable. Define weights (e.g. 30% spread, 25% depth, 25% volume, 20% participation).
2) Either: (a) add column health_score to market_daily_aggregates + migration + backfill logic, or (b) compute in API from existing columns and document in METHODOLOGY. Prefer (a) if we want to sort/filter by score in DB.
3) Expose health_score in GET /api/markets (optional sort=health_score) and GET /api/markets/[id]. Update docs/API.md.
4) Add "Market health score" section to docs/METHODOLOGY.md: formula, weights, interpretation (e.g. 80+ strong, <40 thin).
```

### Frontend (homepage use cases + health score UI)

```
You are working on the Liquidity Intelligence Console dashboard (Next.js App Router, apps/dashboard).

Tasks:
1) Homepage (apps/dashboard/src/app/page.tsx): Add a "Use this to" (or "Why founders use this") section with three bullets: (1) Show investors your liquidity vs incumbents, (2) Spot unhealthy or whale-dominated markets, (3) Compare your spreads and depth to Kalshi and Polymarket. Place near "What it does" or "Who it's for". Match existing design (sections use border-t border-primary/10, max-w-6xl, etc.).
2) Optionally add one hero subline under the main subtitle that summarizes the same three use cases.
3) After health_score is in the API: show health score in the markets list (column or badge) and on market detail page (prominent 0–100 with label "Market health"). Use existing design system; do not break existing layout.
```

### Docs (one-pager + benchmark report + METHODOLOGY)

```
You are working on the Liquidity Intelligence Console docs. Target audience: founders of prediction market platforms (Pred, Kash).

Tasks:
1) Founder one-pager: Create docs/consulting/founder-one-pager.md (and optionally founder-one-pager-deck.md in Marp). Content: title "Liquidity Intelligence – what we measure"; one headline per platform (Pred, Kash, Kalshi, Polymarket); one benchmark table (volume, active markets, avg spread) for a period; "Use this to" three bullets (investors, spot unhealthy markets, compare to Kalshi/Polymarket); optional one-liner on market health score + link to METHODOLOGY. Keep to 1 page or 2–3 slides. Match traceability style of docs/consulting/example-founder-deck.md.

2) Benchmark report: Create docs/reports/example-benchmark-report.md (or 2025-Q1-benchmark.md). Title "Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation" with date range. Sections: methodology (2–3 sentences + link to METHODOLOGY.md), 3–5 charts/tables (volume by platform, active markets, avg spread, optional health score, optional Gini), short narrative "Pred strong on X, Kash on Y" with evidence, caveats. Cite source table and date range for each chart. If no live data, use placeholders and label "Example".

3) If not done by backend agent: Add "Market health score" section to docs/METHODOLOGY.md: definition 0–100, formula (components and weights), interpretation, traceability to market_daily_aggregates.
```

---

## Success criteria (overall)

- [x] Founders see **one number** they can quote: market health score in API and UI, documented in METHODOLOGY.
- [x] Founders see **one artifact** to send first: founder one-pager (and optional short deck).
- [x] Homepage explicitly names **three use cases**: investors, unhealthy markets, compare to incumbents.
- [x] One **benchmark report** exists (dated or example) with 3–5 charts and narrative; forwardable.
- [x] API and METHODOLOGY are updated and consistent with the new metric.

---

## Implementation status (completed)

- **Phase 1**: Health score — migration `20250106000001_market_health_score.sql`, API (list + detail with `health_score`, `sort=health_score`), METHODOLOGY section, dashboard (markets list column + sort, market detail header).
- **Phase 2**: Homepage "Use this to" section + hero subline.
- **Phase 3**: Founder one-pager at `docs/consulting/founder-one-pager.md`.
- **Phase 4**: Benchmark report at `docs/reports/example-benchmark-report.md`; Reports nav link and `/reports` + `/reports/example-benchmark` pages.
- **Phase 5**: API.md can be updated to document `health_score` in response shapes (see docs/API.md).
