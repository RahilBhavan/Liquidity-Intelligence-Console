# Portfolio Extensions: Stand Out to Prediction Markets

Extensions to the Liquidity Intelligence Console that would impress prediction market companies (Pred, Kash, Kalshi, Polymarket, etc.) — for interviews, pitches, or open-source credibility.

---

## Tier 1 — High signal, strong differentiation

### 1. **Order-flow imbalance (OFI) as a leading indicator**

**What**: Per-market time series of buy vs sell pressure (e.g. net notional bought/sold over 5m/1h windows), derived from `trades` (Pred) and `amm_trades` (Kash).

**Why it stands out**: Shows you think like a quant. OFI often leads price; prediction market operators care about informed flow and toxicity. You already have the raw data; adding OFI to `market_liquidity_snapshots` or a dedicated `market_ofi_snapshots` table and one chart on market detail would signal sophistication.

**Rough scope**: New aggregate (or columns), one API route, one chart on market detail + mention in METHODOLOGY.md.

---

### 2. **Cross-market arbitrage / same-event comparison**

**What**: Identify “same event” across platforms (e.g. “Will X happen?” on Pred, Kash, Polymarket) via title/outcome normalization or manual mapping table. Expose price divergence (e.g. Pred 0.52 vs Polymarket 0.48) and optional “arb opportunity” flag or alert.

**Why it stands out**: Arbitrage is core to prediction markets; showing you can surface cross-venue mispricings is directly useful to traders and platforms. It also demonstrates multi-source data fusion.

**Rough scope**: `market_cross_reference` (or link table), normalization rules or UI for mapping, API `GET /api/arbitrage?event=...` or on market detail “Compare on other platforms”, optional simple alert (“spread > 5¢”).

---

### 3. **Wash-trading and sybil detection (heuristics)**

**What**: Lightweight signals, not a full ML model: e.g. (1) same-market round-trips between two wallets in short windows, (2) wallet clustering by timing/amount patterns, (3) concentration of volume in a few new wallets. Expose as “integrity signals” or “wash score” per market (or per wallet) in API + dashboard.

**Why it stands out**: Market integrity is a top concern for prediction markets and regulators. Showing you’ve thought about wash/sybil and built even simple, explainable heuristics sets you apart from “just dashboards.”

**Rough scope**: SQL (or batch job) over `trades`/`amm_trades`/`trader_daily_stats`; one new table or materialized view; API + optional dashboard section or market-level badge.

---

### 4. **Single “market health” or “liquidity score” (0–100)**

**What**: One number per market (or per market-day) combining spread, depth, volume, Gini, and maybe OFI or volatility. Formula in METHODOLOGY.md; used in API, benchmarks page, and market list (sort/filter by score).

**Why it stands out**: Founders and non-quants want a simple “is this market healthy?” answer. A single, documented score shows product sense and forces you to make methodology choices (weights, normalization) that you can defend.

**Rough scope**: Define formula (e.g. spread percentile, depth percentile, inverse Gini), add column to `market_daily_aggregates` or snapshot table; API + UI (table column, detail header, benchmarks).

---

## Tier 2 — Strong portfolio polish

### 5. **Resolution accuracy and calibration**

**What**: For resolved markets: compare final price (or outcome) to resolution; compute simple accuracy (e.g. % correct) or Brier score per market/platform. Store in `market_daily_aggregates` or `markets` (resolution outcome, resolved_at) and a small `market_resolution_stats` table.

**Why it stands out**: Prediction market theory is about accuracy and calibration. Showing you measure “did the market get it right?” aligns you with research and platform goals.

**Rough scope**: Resolution data ingestion (from platform APIs or manual), Brier/accuracy computation, one API route + benchmarks page section or small “accuracy report.”

---

### 6. **Social → liquidity causality (Kash)**

**What**: Lead–lag analysis: does engagement (likes, retweets, etc.) today predict volume or spread change tomorrow (or in 24h)? Simple correlation or regression; present as “social predicts liquidity” or “no significant lead” with a clear caveat.

**Why it stands out**: Kash’s differentiator is social; showing you’ve tested whether virality actually maps to liquidity is exactly what they care about. One chart or table + one methodology subsection is enough.

**Rough scope**: Batch job joining `social_metrics` and `market_daily_aggregates` by market and date with lag; one API or static “research” page; METHODOLOGY.md subsection.

---

### 7. **Alerts / notifications**

**What**: User-configurable alerts, e.g. “Spread on market X &lt; 1%,” “New wallet in top-5 by volume in market Y,” “Cross-market arb &gt; 5¢.” Delivered via email, webhook, or in-app (e.g. “Alerts” page with history).

**Why it stands out**: Turns the console from “read-only analytics” into something operational. Even a minimal version (e.g. webhook + one alert type) shows product and API thinking.

**Rough scope**: `alerts` table (user_id, type, params, last_triggered_at), cron or edge function to evaluate and call webhook/send email; simple UI to create/list alerts.

---

### 8. **Quarterly or one-off “benchmark report” (PDF/Markdown)**

**What**: A short, dated report: “Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation (Q1 2025)” with methodology, 3–5 charts (from your exports), and caveats. Single source in repo (e.g. `docs/reports/2025-Q1-benchmark.md` or PDF).

**Why it stands out**: Positions you as someone who can produce client-ready research, not just dashboards. Easy to attach to applications or share with founders.

**Rough scope**: Use existing PNG/CSV exports and benchmark API; write narrative; optional script to render to PDF.

---

## Tier 3 — Technical and community signal

### 9. **Real-time or near-real-time dashboard**

**What**: WebSocket or short-interval (e.g. 1m) snapshots so the “data as of” is minutes ago, not hours. Supabase Realtime on a “last snapshot” table or polling with a clear “live” indicator.

**Why it stands out**: Many demos are batch-only; “live” feels production-ready and shows you care about operator use cases.

**Rough scope**: More frequent snapshot job; Realtime subscription or aggressive polling; “Data as of X min ago” + optional “Live” badge.

---

### 10. **Embeddable widget**

**What**: A small iframe or script embed: “Liquidity widget for market X” (spread, depth, last update) that Pred/Kash could drop on their docs or status page. Public, documented endpoint (e.g. `GET /embed/market/:id` returning HTML or JSON for a tiny chart).

**Why it stands out**: Shows you think in terms of distribution and partnerships; great “we could white-label this” story.

**Rough scope**: New route returning minimal HTML + JS or JSON; CORS and cache headers; one page in docs with copy-paste embed code.

---

### 11. **Public API with keys and rate limits**

**What**: API key signup (even if fake or manual at first), rate limits (e.g. 100 req/min per key), and docs that say “Production use: get a key.” Optionally usage dashboard for key holders.

**Why it stands out**: Signals “this is a real API product,” not just a side project. Prediction market infra teams care about API discipline.

**Rough scope**: `api_keys` table, middleware to check key and increment usage, simple signup or “Request key” form; update API.md.

---

### 12. **Open-source schema + minimal “reference” indexer**

**What**: Publish the schema (SQL migrations or ERD) and one minimal indexer (e.g. Pred events → raw table only) as a separate repo or well-marked folder (“Reference implementation”). README: “Here’s how we model prediction market data; here’s a starter indexer.”

**Why it stands out**: Attracts contributors and shows you can design for reuse. Employers can see how you think about data modeling and pipelines.

**Rough scope**: Extract schema to `schema/` or `packages/schema/`; add minimal Pred indexer (e.g. 100 lines); README with “Why this shape” and “How to run.”

---

## Suggested order for maximum impact

| Priority | Extension | Reason |
|----------|-----------|--------|
| 1 | Market health / liquidity score | Single, memorable differentiator; uses existing data. |
| 2 | OFI (order-flow imbalance) | Strong quant signal with minimal new infra. |
| 3 | Cross-market arbitrage view | Directly relevant to prediction market value prop. |
| 4 | Benchmark report (one PDF/MD) | Easy to attach to applications; shows research output. |
| 5 | Wash-trading heuristics | Integrity angle; differentiates from “just charts.” |
| 6 | Alerts (webhook or email) | Turns console into something “usable” daily. |

Use **METHODOLOGY.md** and **docs/API.md** to document every new metric and endpoint so the project stays traceable and credible.
