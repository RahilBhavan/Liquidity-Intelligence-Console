# Pred Liquidity Diagnostic (Draft)

**Source**: `market_liquidity_snapshots`, `market_daily_aggregates`, `trader_daily_stats`.  
**Queries**: Traceable to schema in `.cursor/skills/liquidity-console-domain/reference.md`.

## 1. Executive summary

- **Spreads**: Time-weighted average and median spread (bps) from `market_liquidity_snapshots.spread_bps` and `market_daily_aggregates.avg_spread` / `median_spread`.
- **Depth**: Top-of-book and 5-level depth from `depth_bid_1`, `depth_ask_1`, `depth_bid_5`, `depth_ask_5`; peaks from `max_depth_bid_5`, `max_depth_ask_5` in daily aggregates.
- **Volume**: `total_volume`, `num_trades`, `unique_traders` from `market_daily_aggregates`.
- **Concentration**: `gini_participation` from `market_daily_aggregates`; whale vs retail from `trader_daily_stats` (top wallets by maker_volume + taker_volume).

## 2. Key charts (traceable)

| Chart | Table(s) | Key columns |
|-------|----------|-------------|
| Spread over time | market_liquidity_snapshots | market_id, timestamp, spread_bps |
| Daily volume by market | market_daily_aggregates | market_id, date, total_volume |
| Depth distribution | market_liquidity_snapshots | depth_bid_5, depth_ask_5 |
| Trader concentration | market_daily_aggregates, trader_daily_stats | gini_participation, wallet volume share |

## 3. Narrative placeholders

- _[Insert 2–4 pages of narrative with charts once data is available.]_
- _Back each claim with the query or table name._
