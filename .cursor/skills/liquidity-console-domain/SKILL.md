---
name: liquidity-console-domain
description: Domain model and pipeline for the Liquidity Intelligence Console (Pred + Kash). Use when designing schema, writing ingestion/normalization, defining metrics (spreads, depth, OFI, Gini), or implementing API/dashboard for markets, liquidity snapshots, or social metrics.
---

# Liquidity Console Domain

## Pipeline

**Raw → Normalized → Aggregated.** Raw tables are append-only mirrors of chain/API; normalization produces clean entities; analytics jobs fill fact tables. Ingestion must be idempotent (natural keys); partition large time-series by date.

## Reference Tables

- **platforms**: id, name (pred, kash, polymarket, kalshi), type, chain, is_incumbent.
- **markets**: id, platform_id, external_market_id, symbol, title, category, subcategory, event_start_time, event_end_time, status, settlement_source, base_currency, etc.
- **market_outcomes**: id, market_id, outcome_key (YES/NO, HOME/AWAY), description, is_winning, payout_ratio.
- **wallets**: id, platform_id, address, is_contract, first_seen_at.

## Pred (Order-Book)

- **pred_raw_events**: Append-only; id, block_number, tx_hash, log_index, event_name, contract_addr, raw_data (jsonb), timestamp, ingested_at. Natural key (block_number, tx_hash, log_index).
- **orders**: market_id, wallet_id, side, price, size, remaining_size, status, placed_at, cancelled_at, source_event_id. Index (market_id, side, price), (wallet_id, placed_at).
- **trades**: market_id, buy_order_id, sell_order_id, price, size, taker_side, tx_hash, timestamp. Index (market_id, timestamp).
- **positions** (optional): market_id, wallet_id, outcome_id, net_size, avg_entry_price, realized_pnl, updated_at.

## Kash (AMM + Social)

- **kash_raw_events**: Same shape as pred_raw_events; append-only.
- **amm_trades**: market_id, wallet_id, direction (buy_shares/sell_shares), outcome_id, price, size, notional, tx_hash, timestamp, fee_amount.
- **social_posts**: platform (x), external_post_id, author_handle, author_id, created_at, text, language, url.
- **social_metrics**: social_post_id, timestamp, likes, retweets, quotes, replies, views; partition by date.
- **social_market_links**: market_id, social_post_id, relation_type (seed_post, reply, quote, thread).
- **social_sentiment** (optional): social_post_id, model_name, run_at, sentiment_score, sentiment_label, topic_vector (jsonb).

## Unified Fact Tables

- **market_liquidity_snapshots**: market_id, platform_id, timestamp, best_bid_price, best_ask_price, spread, spread_bps, depth_bid_1, depth_ask_1, depth_bid_5, depth_ask_5, volume_1h, trades_1h, unique_traders_1h. Periodic (e.g. 5–15 min).
- **market_daily_aggregates**: market_id, platform_id, date, total_volume, num_trades, avg_spread, median_spread, realized_vol, max_depth_bid_5, max_depth_ask_5, unique_traders, gini_participation.
- **trader_daily_stats**: wallet_id, platform_id, date, num_trades, maker_volume, taker_volume, amm_volume, pnl_estimate.

## Key Metrics

- **Spreads**: Top-of-book (best_ask - best_bid); store in bps. From orders (Pred) or implied from bonding curve (Kash).
- **Depth**: Sum of size at top 1 and top 5 levels (bid/ask). For Kash, approximate from curve.
- **Volume**: Notional traded; trade count; unique traders (distinct wallets).
- **Concentration**: Gini participation (market_daily_aggregates.gini_participation); whale vs retail from trader_daily_stats + market aggregates.
- **Social (Kash)**: Engagement (likes, retweets, etc.) and optional LLM sentiment; link to markets via social_market_links.

## Conventions

- Use `timestamptz` and `date`; `numeric` for money/probability; `uuid` for internal PKs; `text` for external IDs.
- Index (market_id, timestamp) and (wallet_id, date) on fact tables; BRIN on timestamp where appropriate.
- For full column lists per table, see [reference.md](reference.md) in this folder.
