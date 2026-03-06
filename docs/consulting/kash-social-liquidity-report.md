# Kash Social–Liquidity Report (Draft)

**Source**: `social_metrics`, `social_market_links`, `amm_trades`, `market_daily_aggregates`.  
**Queries**: Traceable to schema in `.cursor/skills/liquidity-console-domain/reference.md`.

## 1. Executive summary

- **Social virality**: Engagement (likes, retweets, quotes, replies, views) from `social_metrics`; link to markets via `social_market_links` (relation_type: seed_post, reply, quote, thread).
- **Liquidity**: `amm_trades` and `market_daily_aggregates` (total_volume, num_trades, unique_traders) per market.
- **Correlation**: Timeline linking post engagement snapshots to liquidity metrics for the same market (join `social_market_links` → `social_metrics` and `market_daily_aggregates` / `market_liquidity_snapshots` by market_id and date/timestamp).

## 2. Key charts (traceable)

| Chart | Table(s) | Key columns |
|-------|----------|-------------|
| Engagement over time | social_metrics | social_post_id, timestamp, likes, retweets, replies |
| Market volume vs engagement | social_market_links, market_daily_aggregates, social_metrics | market_id, date, total_volume, likes |
| Virality vs persistence | social_metrics + market_daily_aggregates by market_id | Compare spike in engagement to subsequent volume |

## 3. Narrative placeholders

- _[Insert narrative on how social virality maps into liquidity and persistence.]_
- _Back each claim with the query or table name._
