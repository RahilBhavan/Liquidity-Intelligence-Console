# Founder-ready deck (template)

**~10 slides summarizing insights; each chart traceable to schema/queries.**

## Slide 1 – Title
Liquidity Intelligence Console: Pred & Kash vs incumbents

## Slide 2 – Overview
- Data sources: Pred (Base), Kash (X + chain), Kalshi/Polymarket (APIs).
- Metrics: spreads, depth, volume, unique traders, concentration (Gini).

## Slide 3 – Pred liquidity
- **Chart**: Spread (bps) over time — source: `market_liquidity_snapshots.spread_bps`, market_id = X, date range Y.
- **Chart**: Daily volume by market — source: `market_daily_aggregates.total_volume`.

## Slide 4 – Kash social–liquidity
- **Chart**: Engagement vs volume — source: `social_metrics` + `market_daily_aggregates` joined by `social_market_links.market_id`.

## Slide 5 – Incumbent benchmark
- **Table**: Pred/Kash vs Kalshi/Polymarket (volume, active markets, avg spread) — source: `market_daily_aggregates` + `incumbent_daily_metrics`.

## Slide 6 – Whale vs retail
- **Chart**: Concentration (Gini) — source: `market_daily_aggregates.gini_participation`.
- **Chart**: Top wallets by volume — source: `trader_daily_stats` / participants API.

## Slide 7 – Key takeaways
- _[Narrative placeholders]_

## Slide 8 – Export & traceability
- All charts exportable as PNG from dashboard or via chart library.
- CSV: `/api/export/market/:id/daily`.
- Each slide cites table name and date range.

## Slide 9 – Appendix: schema
- Raw → Normalized → Aggregated (reference: `.cursor/skills/liquidity-console-domain/reference.md`).

## Slide 10 – Contact / next steps
- _[Placeholder]_
