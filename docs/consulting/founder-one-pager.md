# Liquidity Intelligence – what we measure

**Objective view of spreads, depth, and participant behavior for prediction markets.** One number per market (health score), benchmark tables vs incumbents, and traceability to our schema.

---

## Platform headlines (example period)

- **Pred** — Base-native order book; sub-2% spreads, 200 ms execution; volume and depth from chain.
- **Kash** — Social-native AMM on X; bonding-curve liquidity; engagement and volume linked per market.
- **Kalshi** — Regulated US exchange; volume and active markets from public/API data.
- **Polymarket** — Permissionless prediction markets; volume and spread from incumbent collector.

---

## Benchmark table (example period)

| Platform   | Total volume | Active markets | Avg spread (bps) |
|------------|--------------|----------------|------------------|
| Pred       | Example      | Example        | Example          |
| Kash       | Example      | Example        | Example          |
| Kalshi     | Example      | Example        | Example          |
| Polymarket | Example      | Example        | Example          |

*Source: Pred/Kash — `market_daily_aggregates` (total_volume, avg_spread), `markets` (status = open for active count). Kalshi/Polymarket — `incumbent_daily_metrics` (platform_id, date, metric_name, value). Date range: Example period [e.g. 2025-01-01 to 2025-01-31].*

---

## Use this to

1. **Show investors your liquidity vs incumbents** — Benchmarks and exportable charts; one table to send.
2. **Spot unhealthy or whale-dominated markets** — Health score, Gini, top wallets; flag thin or concentrated books.
3. **Compare your spreads and depth to Kalshi and Polymarket** — Same methodology, same date range; apples-to-apples.

---

## Market health score

We compute a **market health score (0–100)** per market per day from spread, depth, volume, and participation (Gini). **80+** = strong liquidity; **&lt;40** = thin or concentrated. Formula, weights, and interpretation: [METHODOLOGY.md](../METHODOLOGY.md#market-health-score).

---

*Liquidity Intelligence Console — institutional-grade liquidity and market-quality metrics for Pred & Kash.*
