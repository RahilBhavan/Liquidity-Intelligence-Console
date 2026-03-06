# Implementation Plan: Liquidity Intelligence Console Improvements

This plan turns the recommendations in [ASSESSMENT_AND_IMPROVEMENTS.md](./ASSESSMENT_AND_IMPROVEMENTS.md) into actionable phases and tasks. Execute in order where dependencies matter; otherwise phases can be parallelized.

---

## Phase 1 — Positioning & documentation (high impact, low effort)

**Goal**: Professional positioning and one source of truth for metrics. No code beyond copy and new docs.

### 1.1 Positioning and copy

| Task | Details | Files |
|------|---------|--------|
| Update homepage hero | Replace “Student project” with “Independent liquidity intelligence” (or “Third-party analytics for Pred and Kash”). | `apps/dashboard/src/app/page.tsx` |
| Update footer | Keep “Not affiliated with Pred, Kash, or any incumbent”; remove or replace “Student project” with the same tagline. | `apps/dashboard/src/app/page.tsx` |
| Optional: env-driven tagline | If you want a “demo mode” vs “founder mode”, add e.g. `NEXT_PUBLIC_TAGLINE` and use it in hero/footer. | `apps/dashboard/src/app/page.tsx`, `.env.example` |

**Acceptance**: Homepage and footer read as a neutral, third-party product; disclaimer remains visible.

### 1.2 Methodology document

| Task | Details | Files |
|------|---------|--------|
| Create METHODOLOGY.md | Single doc defining: (1) **Spreads** — top-of-book, bps; for Kash, implied from curve. (2) **Depth** — top 1 and top 5 levels; Kash from curve. (3) **Gini participation** — formula + interpretation (0 = even, 1 = one dominates). (4) **Data freshness** — snapshot interval (e.g. 15m), daily aggregate run time (e.g. 00:00 UTC). | `docs/METHODOLOGY.md` |

**Acceptance**: A founder or quant can answer “how is spread/depth/Gini computed?” from this doc.

### 1.3 API documentation

| Task | Details | Files |
|------|---------|--------|
| Create API.md | List all public API routes with method, path, query/params, short description. Include example response shape or link to schema. Endpoints: `GET /api/markets`, `GET /api/markets/[id]`, `GET /api/markets/[id]/liquidity`, `GET /api/markets/[id]/participants`, `GET /api/social/[marketId]`, `GET /api/export/market/[id]/daily`. | `docs/API.md` |
| Optional: in-app /docs | Add route `apps/dashboard/src/app/docs/page.tsx` that renders API overview (or embeds `docs/API.md`). Link from header or footer. | `apps/dashboard/src/app/docs/page.tsx`, `site-header.tsx` |

**Acceptance**: Developers can discover and use the API from `docs/API.md` (and optionally from the app).

### 1.4 Data and privacy note

| Task | Details | Files |
|------|---------|--------|
| Create DATA_AND_PRIVACY.md | Short note: data in Supabase; no PII beyond on-chain addresses and public social handles; no third-party sharing; secrets via env. | `docs/DATA_AND_PRIVACY.md` |

**Acceptance**: One place to point to for “what do you do with data?”.

### 1.5 README updates

| Task | Details | Files |
|------|---------|--------|
| Quick demo sentence | Add: “To see the UI without data: `bun run dev` and open `/markets` (empty until ingestion runs).” | `README.md` |
| Link to docs | Add links to Methodology, API, and (optional) Data & privacy in README. | `README.md` |

**Acceptance**: New users see how to run a quick demo and where to find methodology/API.

---

## Phase 2 — Dashboard: data freshness & benchmark view (medium impact)

**Goal**: “Data as of” on the app; one screen comparing Pred/Kash vs incumbents.

### 2.1 Data freshness (“as of”)

| Task | Details | Files |
|------|---------|--------|
| API for latest timestamp | New route `GET /api/status` (or extend an existing health route) returning e.g. `{ dataAsOf: "<max timestamp from market_liquidity_snapshots or market_daily_aggregates>" }`. | `apps/dashboard/src/app/api/status/route.ts` (or similar) |
| Show in UI | On overview and/or markets page (or in header/footer), display “Data as of &lt;date/time&gt;”. Call the new API from a client or server component. | `apps/dashboard/src/app/page.tsx` and/or `apps/dashboard/src/components/site-header.tsx`, or a shared footer component |

**Acceptance**: User sees when the displayed data was last updated.

### 2.2 Benchmark view (Pred vs Kash vs Kalshi vs Polymarket)

| Task | Details | Files |
|------|---------|--------|
| API for platform-level metrics | New route `GET /api/benchmarks?from=YYYY-MM-DD&to=YYYY-MM-DD` that aggregates `market_daily_aggregates` by platform (total_volume, active markets from markets count or aggregates, avg spread) and joins `incumbent_daily_metrics` for Kalshi/Polymarket (metric_name: total_volume, active_markets_count, etc.). Return array by platform. | `apps/dashboard/src/app/api/benchmarks/route.ts` |
| Benchmarks page or section | New page `apps/dashboard/src/app/benchmarks/page.tsx` (or a section on the overview): table/cards with Platform, Total volume (period), Active markets, Avg spread. Use same design system as markets table. | `apps/dashboard/src/app/benchmarks/page.tsx` |
| Navigation | Add “Benchmarks” link to `SiteHeader` (and optionally to homepage value grid). | `apps/dashboard/src/components/site-header.tsx`, optionally `page.tsx` |

**Acceptance**: One view shows Pred, Kash, Kalshi, Polymarket side-by-side on headline metrics; data comes from existing schema.

---

## Phase 3 — Chart export (PNG) (medium impact)

**Goal**: Export charts as PNG from market detail (and any other chart views).

### 3.1 PNG export on market detail

| Task | Details | Files |
|------|---------|--------|
| Add export dependency | Use `html-to-image` (or Recharts’ built-in if available) to capture the liquidity chart container. | `apps/dashboard/package.json` |
| Export button | “Download PNG” (or “Export chart”) next to the liquidity chart on market detail page. On click: capture chart container, create blob, trigger download with filename e.g. `market-{id}-liquidity-{date}.png`. | `apps/dashboard/src/app/markets/[id]/page.tsx` |
| Optional: export all charts on page | If there are multiple charts (e.g. liquidity + participants), either one button per chart or one “Export all as ZIP” (add dependency). Prefer one button per chart for Phase 3. | Same file |

**Acceptance**: User can download the liquidity chart as PNG from the market detail page.

### 3.2 Optional: PNG on other views

| Task | Details | Files |
|------|---------|--------|
| Social view | If there’s a chart on `apps/dashboard/src/app/social/[marketId]/page.tsx`, add “Download PNG” there too. | `apps/dashboard/src/app/social/[marketId]/page.tsx` |

**Acceptance**: Any chart view that matters for reports has PNG export.

---

## Phase 4 — Founder deck (high impact for pitch)

**Goal**: One complete example deck so Pred/Kash can see a real deliverable.

### 4.1 Filled example deck

| Task | Details | Files |
|------|---------|--------|
| Create deck artifact | One “example” deck (Google Slides, PPTX, or Markdown-based slides e.g. Marp). Content: Title → Overview (sources, metrics) → Pred liquidity (spread + volume charts; cite table + date range) → Kash social–liquidity (engagement vs volume; cite tables) → Incumbent benchmark table (Pred/Kash/Kalshi/Polymarket) → Whale vs retail (Gini or top wallets) → Export & traceability → Contact/next steps. Use real screenshots or exported PNGs from the app if data exists; otherwise placeholders with clear “Example” labels. | `docs/consulting/example-founder-deck.md` (Marp) or `docs/consulting/example-founder-deck.pptx` or link to Google Slides in README |
| Traceability | Every chart/slide cites the source table and (where relevant) date range, as in the existing deck template. | Same artifact |

**Acceptance**: A stakeholder can open one deck and see the full narrative with traceable metrics.

---

## Phase 5 — Tests and CI (medium impact, production feel)

**Goal**: Critical-path tests and CI that runs on every push/PR.

### 5.1 API route tests

| Task | Details | Files |
|------|---------|--------|
| Test setup | Use Vitest (or Jest) + optional Next.js route test helpers. Use Supabase local or mocks so tests don’t hit production. | `apps/dashboard/package.json`, `apps/dashboard/vitest.config.ts` or similar |
| Tests for key routes | At least: `GET /api/markets` (returns 200, shape with data/nextOffset); `GET /api/markets/[id]` (404 when missing, 200 with body when present). Mock Supabase in tests if needed. | `apps/dashboard/src/app/api/markets/route.test.ts`, `apps/dashboard/src/app/api/markets/[id]/route.test.ts` (or under `__tests__`) |
| Script | Add `"test": "vitest run"` (or equivalent) in `apps/dashboard/package.json`; root `package.json` can have `"test": "bun run --cwd apps/dashboard test"`. | `apps/dashboard/package.json`, root `package.json` |

**Acceptance**: `bun run test` runs and at least two API route tests pass.

### 5.2 CI workflow

| Task | Details | Files |
|------|---------|--------|
| GitHub Actions workflow | On push/PR: install deps (`bun install`), run `bun run build`, run `bun run test`. | `.github/workflows/ci.yml` |

**Acceptance**: Pushing triggers CI; build and tests must pass.

---

## Phase 6 — Optional polish ✅

- **In-app /docs**: ✅ Added `apps/dashboard/src/app/docs/page.tsx` — API overview, methodology summary, data & privacy. “Docs” link in site header.
- **Health/status route**: ✅ `GET /api/status` now returns `ok`, `status` (`"healthy"` / `"unhealthy"`) and on 500 returns the same shape with `ok: false` for monitoring.
- **OpenAPI spec**: ✅ Created `docs/openapi.yaml` (OpenAPI 3.1); linked from top of `docs/API.md`.

---

## Execution order (recommended)

| Order | Phase | Rationale |
|-------|--------|-----------|
| 1 | Phase 1 (positioning + docs) | Fast, high impact; unblocks “professional” first impression. |
| 2 | Phase 2 (freshness + benchmarks) | Makes the dashboard more credible and comparative. |
| 3 | Phase 3 (PNG export) | Directly supports decks and reports. |
| 4 | Phase 4 (example deck) | Delivers a concrete pitch artifact. |
| 5 | Phase 5 (tests + CI) | Locks in quality and signals production readiness. |
| 6 | Phase 6 (optional) | As time allows. |

---

## File checklist (quick reference)

- [x] `apps/dashboard/src/app/page.tsx` — positioning copy
- [x] `docs/METHODOLOGY.md` — new
- [x] `docs/API.md` — new
- [x] `docs/DATA_AND_PRIVACY.md` — new
- [x] `README.md` — quick demo + doc links
- [x] `apps/dashboard/src/app/api/status/route.ts` (or similar) — data as of
- [x] `apps/dashboard/src/app/api/benchmarks/route.ts` — new
- [x] `apps/dashboard/src/app/benchmarks/page.tsx` — new
- [x] `apps/dashboard/src/components/site-header.tsx` — nav + optional “data as of”
- [x] `apps/dashboard/src/app/markets/[id]/page.tsx` — PNG export
- [x] `docs/consulting/example-founder-deck.*` — new
- [x] `apps/dashboard/src/app/api/markets/route.test.ts` (or equivalent) — new
- [x] `apps/dashboard/src/app/api/markets/[id]/route.test.ts` — new
- [x] `apps/dashboard/package.json` — test script + optional deps
- [x] `.github/workflows/ci.yml` — new

---

## Success criteria (overall)

- Homepage and footer present the product as “independent liquidity intelligence” with a clear disclaimer.
- Methodology and API are documented; data/privacy is summarized.
- Dashboard shows “Data as of” and a benchmark view (Pred/Kash vs incumbents).
- Market detail (and other chart views as needed) support PNG export.
- One complete example founder deck exists with traceability.
- `bun run test` passes and CI runs on push/PR.

After this plan, the console should feel professional and world-class for a Pred/Kash-facing demo or pitch.
