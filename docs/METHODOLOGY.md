# Methodology & Metrics Definitions

This document defines how the Liquidity Intelligence Console computes and reports metrics. All figures are traceable to the schema (see `.cursor/skills/liquidity-console-domain/reference.md`).

---

## Spreads

- **Definition**: Top-of-book spread = best ask price − best bid price (in outcome price units, e.g. 0–1 for binary markets).
- **Reporting**: Stored and displayed in **basis points (bps)**. 1 bps = 0.01%. For a binary market, 100 bps ≈ 1% of the price range.
- **Sources**:
  - **Pred (order book)**: Best bid and best ask are taken from the live order book (normalized `orders` table); spread is computed at snapshot time.
  - **Kash (AMM)**: Spread is **implied from the bonding curve**. The effective bid is the price to sell one unit; the effective ask is the price to buy one unit. The difference is stored as `spread_bps` in `market_liquidity_snapshots`.
- **Tables**: `market_liquidity_snapshots.spread`, `market_liquidity_snapshots.spread_bps`; daily rollups in `market_daily_aggregates.avg_spread`, `market_daily_aggregates.median_spread`.

---

## Depth

- **Definition**:
  - **Depth at top 1**: Total size (in outcome units) at the best bid and best ask.
  - **Depth at top 5**: Sum of size at the best 5 price levels on the bid side and the best 5 levels on the ask side.
- **Sources**:
  - **Pred**: From the order book; sum of `size - remaining_size` (filled + resting) at each level.
  - **Kash**: **Approximated from the bonding curve** — equivalent size that can be traded at the current mid (or at a small delta from mid) to approximate top-of-book and multi-level depth.
- **Tables**: `market_liquidity_snapshots.depth_bid_1`, `depth_ask_1`, `depth_bid_5`, `depth_ask_5`; daily peaks in `market_daily_aggregates.max_depth_bid_5`, `max_depth_ask_5`.

---

## Volume & participation

- **Volume**: Notional traded (price × size) in base currency. Aggregated from `trades` (Pred) and `amm_trades` (Kash; field `notional`).
- **Trade count**: Number of trades in the period.
- **Unique traders**: Count of distinct `wallet_id` in the period.
- **Tables**: `market_daily_aggregates.total_volume`, `num_trades`, `unique_traders`; intraday in `market_liquidity_snapshots.volume_1h`, `trades_1h`, `unique_traders_1h`.

---

## Gini participation

- **Definition**: Gini coefficient of **participation** — how evenly volume is distributed across wallets in the market over the period. Formula: standard Gini on the distribution of per-wallet volume shares (0 = perfectly even; 1 = one wallet has all volume).
- **Interpretation**: Lower Gini = more diversified participation; higher Gini = whale-dominated. Used to flag wash-trading risk and concentration.
- **Table**: `market_daily_aggregates.gini_participation`.

---

## Market health score

- **Definition**: A single number from **0 to 100** per market per day. **0** = poor liquidity and/or highly concentrated participation; **100** = strong liquidity, depth, volume, and even participation. Intended for founders and analysts to quote one comparable metric across markets and platforms.
- **Formula**: Weighted sum of four percentile-based components, computed **within (platform_id, date)** so scores are comparable across the same platform and day:
  - **Spread (30%)**: Lower spread is better. Component = 1 − percentile_rank(avg_spread). Tighter spreads contribute more to the score.
  - **Depth (25%)**: Higher depth is better. Component = percentile_rank(max_depth_bid_5 + max_depth_ask_5). Deeper books score higher.
  - **Volume (25%)**: Higher volume is better. Component = percentile_rank(total_volume).
  - **Participation (20%)**: More even participation is better. Component = percentile_rank(1 − gini_participation). Lower Gini (more even) scores higher.
- **Weights**: 30% spread, 25% depth, 25% volume, 20% participation. Final score = (weighted sum of components) × 100, clamped to [0, 100].
- **Interpretation**:
  - **80–100**: Strong liquidity and participation; suitable for highlighting to investors or as a benchmark.
  - **40–79**: Moderate; worth monitoring for concentration or thinness.
  - **0–39**: Thin and/or whale-dominated; high spread, low depth, or concentrated participation.
- **Traceability**: Stored in `market_daily_aggregates.health_score`. Computed from the same table’s `avg_spread`, `max_depth_bid_5`, `max_depth_ask_5`, `total_volume`, and `gini_participation` using percentiles per (platform_id, date). Backfill and ongoing updates are documented in the migration `supabase/migrations/20250106000001_market_health_score.sql`.

---

## Whale vs retail

- **Source**: `trader_daily_stats` (per wallet, per platform, per day): `maker_volume`, `taker_volume`, `amm_volume`, `pnl_estimate`. Top wallets by volume are exposed via the participants API and market detail page.
- **Use**: Identify markets where a small set of wallets dominates volume; cross-reference with Gini for narrative.

---

## Data freshness

- **Liquidity snapshots** (`market_liquidity_snapshots`): Produced by the liquidity-snapshots analytics job. Typical interval: **every 15 minutes** (configurable). Each row is a point-in-time snapshot for a market.
- **Daily aggregates** (`market_daily_aggregates`, `trader_daily_stats`): Produced by the market-daily and trader-daily analytics jobs. Typically run **once per day** (e.g. after midnight UTC) for the previous calendar day.
- **Raw events**: Ingested continuously (or on a schedule) by the Pred indexer, Kash indexer, and incumbent collector. Normalization and analytics run after raw data is present.

The dashboard can display a “Data as of” timestamp (e.g. latest snapshot or latest aggregate date) so users know the freshness of the figures they see.
