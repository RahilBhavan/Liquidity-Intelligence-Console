# Incumbent Benchmarking (Draft)

**Source**: `incumbent_daily_metrics` (Kalshi, Polymarket), `market_daily_aggregates` (Pred, Kash).  
**Queries**: Traceable to schema and `docs/incumbent-apis.md`.

## 1. Headline metrics to compare

| Metric | Pred/Kash source | Incumbent source |
|--------|------------------|------------------|
| Daily volume | market_daily_aggregates.total_volume (by platform_id) | incumbent_daily_metrics (metric_name = total_volume or similar) |
| Active markets | COUNT(markets) where status = open | incumbent_daily_metrics (active_markets_count) |
| Avg spread | market_daily_aggregates.avg_spread | incumbent_daily_metrics if exposed by API |

## 2. Table template

| Platform | Date | Total volume | Active markets | Avg spread (bps) |
|----------|------|--------------|----------------|------------------|
| pred | _from market_daily_aggregates_ | | | |
| kash | _from market_daily_aggregates_ | | | |
| kalshi | _from incumbent_daily_metrics_ | | | |
| polymarket | _from incumbent_daily_metrics_ | | | |

## 3. Narrative placeholders

- _[Insert short section comparing Pred/Kash to Kalshi/Polymarket once data is filled.]_
