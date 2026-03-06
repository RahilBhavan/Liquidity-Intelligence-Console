# Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation

**Example period** — *Liquidity Intelligence Console benchmark report*

---

## Methodology

We measure spreads (bps), depth (top 5 levels), volume, unique traders, and participation concentration (Gini). Pred and Kash are sourced from our chain indexers and normalized pipeline; Kalshi and Polymarket from incumbent API collectors. All figures are rolled up by platform and date. Full definitions (spread, depth, Gini, health score): [METHODOLOGY.md](../METHODOLOGY.md).

---

## 1. Total volume by platform

| Platform   | Total volume (Example period) |
|------------|-------------------------------|
| Pred       | Example                       |
| Kash       | Example                       |
| Kalshi     | Example                       |
| Polymarket | Example                       |

*Source: Pred/Kash — `market_daily_aggregates.total_volume` (sum by platform_id, date in range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = total_volume). Date range: Example period.*

---

## 2. Active markets

| Platform   | Active markets (Example period) |
|------------|----------------------------------|
| Pred       | Example                          |
| Kash       | Example                          |
| Kalshi     | Example                          |
| Polymarket | Example                          |

*Source: Pred/Kash — `markets` (count where status = open, platform_id, and market has activity in date range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = active_markets_count). Date range: Example period.*

---

## 3. Average spread (bps)

| Platform   | Avg spread (bps) (Example period) |
|------------|------------------------------------|
| Pred       | Example                            |
| Kash       | Example                            |
| Kalshi     | Example                            |
| Polymarket | Example                            |

*Source: Pred/Kash — `market_daily_aggregates.avg_spread` (average across market-days by platform_id, date in range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = avg_spread). Date range: Example period.*

---

## 4. Market health score (Example)

| Platform   | Median health score (0–100) |
|------------|-----------------------------|
| Pred       | Example                     |
| Kash       | Example                     |
| Kalshi     | Example                     |
| Polymarket | Example                     |

*Source: `market_daily_aggregates.health_score` (median by platform_id, date in range). Incumbents: health_score where available from incumbent_daily_metrics or N/A. Date range: Example period.*

---

## 5. Participation concentration (Gini) — Pred & Kash

| Platform | Median Gini participation (0 = even, 1 = concentrated) |
|----------|----------------------------------------------------------|
| Pred     | Example                                                  |
| Kash     | Example                                                  |

*Source: `market_daily_aggregates.gini_participation` (median by platform_id, date in range). Gini not shown for incumbents (different data model). Date range: Example period.*

---

## Narrative (example)

**Pred** is strong on **tight spreads and depth** in the example period: order-book execution and sub-2% spreads show up in the avg spread table; depth and volume are traceable to chain. **Kash** stands out on **social–liquidity linkage**: engagement (likes, retweets, views) can be joined to market volume via `social_market_links` and `social_metrics`; the Gini table highlights whether liquidity is diversified or whale-dominated. **Kalshi** and **Polymarket** provide the incumbent benchmark for volume and active markets; our methodology keeps definitions aligned so founders can compare Pred and Kash to the same yardstick.

---

## Caveats

- **Data freshness**: Pred/Kash aggregates depend on indexer and analytics job schedules; daily aggregates typically run after midnight UTC. Incumbent data depends on external API availability and rate limits.
- **Incumbent sources**: Kalshi and Polymarket figures are from our incumbent collector; definitions are aligned where possible but may differ from each platform’s own reporting.
- **Example data**: This report uses placeholders labeled “Example” until live data is backfilled; replace with actual values and date range when generating a dated report.

---

*Liquidity Intelligence Console — every table cites source and date range. Forwardable benchmark report for founders.*
