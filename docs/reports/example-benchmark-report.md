# Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation

**Q1 2025** — *Liquidity Intelligence Console benchmark report*

---

## Methodology

We measure spreads (bps), depth (top 5 levels), volume, unique traders, and participation concentration (Gini). Pred and Kash are sourced from our chain indexers and normalized pipeline; Kalshi and Polymarket from incumbent API collectors. All figures are rolled up by platform and date. Full definitions (spread, depth, Gini, health score): [METHODOLOGY.md](../METHODOLOGY.md).

---

## 1. Total volume by platform

| Platform   | Total volume (Q1 2025)        |
|------------|-------------------------------|
| Pred       | $42.5M                        |
| Kash       | $18.2M                        |
| Kalshi     | $115.0M                       |
| Polymarket | $350.5M                       |

*Source: Pred/Kash — `market_daily_aggregates.total_volume` (sum by platform_id, date in range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = total_volume). Date range: Q1 2025.*

---

## 2. Active markets

| Platform   | Active markets (Q1 2025)         |
|------------|----------------------------------|
| Pred       | 150                              |
| Kash       | 320                              |
| Kalshi     | 540                              |
| Polymarket | 850                              |

*Source: Pred/Kash — `markets` (count where status = open, platform_id, and market has activity in date range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = active_markets_count). Date range: Q1 2025.*

---

## 3. Average spread (bps)

| Platform   | Avg spread (bps) (Q1 2025)         |
|------------|------------------------------------|
| Pred       | 185 bps                            |
| Kash       | 350 bps                            |
| Kalshi     | 250 bps                            |
| Polymarket | 210 bps                            |

*Source: Pred/Kash — `market_daily_aggregates.avg_spread` (average across market-days by platform_id, date in range). Kalshi/Polymarket — `incumbent_daily_metrics` (metric_name = avg_spread). Date range: Q1 2025.*

---

## 4. Market health score (Q1 2025)

| Platform   | Median health score (0–100) |
|------------|-----------------------------|
| Pred       | 82                          |
| Kash       | 75                          |
| Kalshi     | 88                          |
| Polymarket | 92                          |

*Source: `market_daily_aggregates.health_score` (median by platform_id, date in range). Incumbents: health_score where available from incumbent_daily_metrics or N/A. Date range: Q1 2025.*

---

## 5. Participation concentration (Gini) — Pred & Kash

| Platform | Median Gini participation (0 = even, 1 = concentrated) |
|----------|----------------------------------------------------------|
| Pred     | 0.42                                                     |
| Kash     | 0.65                                                     |

*Source: `market_daily_aggregates.gini_participation` (median by platform_id, date in range). Gini not shown for incumbents (different data model). Date range: Q1 2025.*

---

## Narrative (Q1 2025)

**Pred** is strong on **tight spreads and depth** in Q1 2025: order-book execution and sub-2% spreads show up in the avg spread table (185 bps vs Polymarket's 210 bps); depth and volume are traceable to chain. **Kash** stands out on **social–liquidity linkage**: engagement (likes, retweets, views) can be joined to market volume via `social_market_links` and `social_metrics`; the Gini table (0.65) highlights that Kash liquidity is slightly more whale-dominated compared to Pred's more retail-driven structure (0.42). **Kalshi** and **Polymarket** provide the incumbent benchmark for volume and active markets; our methodology keeps definitions aligned so founders can compare Pred and Kash to the same yardstick.

---

## Caveats

- **Data freshness**: Pred/Kash aggregates depend on indexer and analytics job schedules; daily aggregates typically run after midnight UTC. Incumbent data depends on external API availability and rate limits.
- **Incumbent sources**: Kalshi and Polymarket figures are from our incumbent collector; definitions are aligned where possible but may differ from each platform’s own reporting.
- **Example data**: This report uses mock data for Q1 2025 for illustration purposes until live data is fully backfilled.

---

*Liquidity Intelligence Console — every table cites source and date range. Forwardable benchmark report for founders.*