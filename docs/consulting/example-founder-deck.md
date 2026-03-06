---
marp: true
theme: default
paginate: true
title: Liquidity Intelligence Console – Example Founder Deck
---

<!-- _class: lead -->
# Liquidity Intelligence Console
## Pred & Kash vs Incumbents

**Objective view of spreads, depth, and participant behavior**

*Example founder-ready deliverable — every chart traceable to schema*

---

## Overview: Sources & Metrics

**Data sources**
- **Pred**: Base-native order-book (chain indexer → raw → normalized).
- **Kash**: Social-native AMM on X + chain (raw events + social APIs).
- **Incumbents**: Kalshi, Polymarket (API collectors → `incumbent_daily_metrics`).

**Metrics we expose**
- Spreads (bps), depth (top 1 / top 5), volume, unique traders.
- Concentration: Gini participation, whale vs retail (top wallets by volume).
- Social: engagement (likes, retweets, replies, views) linked to markets.

*Source: Raw → Normalized → Aggregated pipeline; `.cursor/skills/liquidity-console-domain/reference.md`*

---

## Pred Liquidity: Spread & Volume

**Chart 1 – Spread (bps) over time**
- Time-weighted spread per market.
- *Source: `market_liquidity_snapshots.spread_bps`, `market_liquidity_snapshots.timestamp`*  
  *Filter: market_id = [selected], date range [e.g. 2025-01-01 to 2025-01-31].*

**Chart 2 – Daily volume by market**
- Total notional and trade count per market per day.
- *Source: `market_daily_aggregates.total_volume`, `market_daily_aggregates.num_trades`, `market_daily_aggregates.date`*  
  *Filter: platform_id = Pred, date range [e.g. 2025-01-01 to 2025-01-31].*

---

## Kash: Social–Liquidity Link

**Chart – Engagement vs volume (by market)**
- For each Kash market linked to social posts: engagement over time vs daily volume.
- Join: `social_market_links` (market_id, social_post_id) → `social_metrics` (likes, retweets, replies, views, timestamp) and `market_daily_aggregates` (total_volume, date) by market_id and date.
- *Source: `social_metrics.likes`, `social_metrics.retweets`, `social_metrics.replies`, `social_metrics.views`; `market_daily_aggregates.total_volume`; link via `social_market_links.market_id`, `social_market_links.social_post_id`.*  
  *Date range: [e.g. 2025-01-01 to 2025-01-31].*

---

## Incumbent Benchmark

| Platform   | Date range      | Total volume | Active markets | Avg spread (bps) |
|-----------|-----------------|--------------|----------------|------------------|
| Pred      | _[e.g. 2025-01]_| _from aggregates_ | _from markets count_ | _from aggregates_ |
| Kash      | _[e.g. 2025-01]_| _from aggregates_ | _from markets count_ | _from aggregates_ |
| Kalshi    | _[e.g. 2025-01]_| _from incumbent_  | _from incumbent_  | _from incumbent_  |
| Polymarket| _[e.g. 2025-01]_| _from incumbent_  | _from incumbent_  | _from incumbent_  |

*Source: Pred/Kash — `market_daily_aggregates` (total_volume, avg_spread), `markets` (status = open for active count). Kalshi/Polymarket — `incumbent_daily_metrics` (platform_id, date, metric_name, value: total_volume, active_markets_count, avg_spread).*

---

## Whale vs Retail

**Chart 1 – Concentration (Gini)**
- Gini coefficient of participation per market per day (0 = even, 1 = one dominant wallet).
- *Source: `market_daily_aggregates.gini_participation`, `market_daily_aggregates.date`, `market_daily_aggregates.market_id`.*  
  *Date range: [e.g. 2025-01-01 to 2025-01-31].*

**Chart 2 – Top wallets by volume**
- Ranked list of wallets by maker + taker (Pred) or AMM volume (Kash) per day or period.
- *Source: `trader_daily_stats.maker_volume`, `trader_daily_stats.taker_volume`, `trader_daily_stats.amm_volume`, `trader_daily_stats.wallet_id`, `trader_daily_stats.date`.*  
  *Filter: platform_id, date range [e.g. 2025-01-01 to 2025-01-31].*

---

## Export & Traceability

- **Charts**: Exportable as PNG from the dashboard or via chart library; each chart cites table and columns in the UI.
- **CSV**: `/api/export/market/:id/daily` — daily series for a market (volume, spread, traders, etc.).
- **Traceability**: Every slide in this deck cites source table(s) and, where applicable, date range; queries align with `.cursor/skills/liquidity-console-domain/reference.md`.

*Source: API routes and dashboard export features; schema reference above.*

---

## Appendix: Schema (high level)

**Raw** (append-only): `pred_raw_events`, `kash_raw_events` — block, tx, log_index, event_name, raw_data, timestamp.

**Normalized**: `platforms`, `markets`, `market_outcomes`, `wallets`, `orders`, `trades`, `amm_trades`, `social_posts`, `social_metrics`, `social_market_links`.

**Aggregated**: `market_liquidity_snapshots`, `market_daily_aggregates`, `trader_daily_stats`, `incumbent_daily_metrics`.

*Full column reference: `.cursor/skills/liquidity-console-domain/reference.md`*

---

## Contact & Next Steps

- **Deliverables**: This deck is one example; we can tailor slides to your chosen markets and date ranges.
- **Data refresh**: Ingestion and aggregates run on configurable schedules; benchmarks vs incumbents updated daily where APIs allow.
- **Next**: Pick 2–3 headline charts to lock first (e.g. Pred spread + volume, Kash engagement–volume, incumbent table); we fill with live data and narrative.

*Liquidity Intelligence Console — institutional-grade liquidity and market-quality metrics for Pred & Kash.*
