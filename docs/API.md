# API Reference

Base URL: same origin as the dashboard (e.g. `http://localhost:3000` when running `bun run dev`). All responses are JSON unless noted (CSV for export).

**OpenAPI 3.x spec**: [openapi.yaml](./openapi.yaml) — machine-readable definition for codegen and tooling.

---

## Status

### Data freshness and health

**`GET /api/status`**

Returns the latest data timestamp (“Data as of”) and app health for monitoring.

**Response (200)**: `{ ok: true, status: "healthy", data: { dataAsOf, dataAsOfSnapshot, dataAsOfDaily } }`  
- `ok`: `true` when the app and DB are reachable.  
- `status`: `"healthy"` or (on error) `"unhealthy"`.  
- `data.dataAsOf`: Preferred display value (latest snapshot timestamp, or latest daily date).  
- `data.dataAsOfSnapshot`: Max `timestamp` from `market_liquidity_snapshots`.  
- `data.dataAsOfDaily`: Max `date` from `market_daily_aggregates`.

**Response (500)**: `{ ok: false, status: "unhealthy", error: string, data: { ... } }` when the request fails (e.g. DB error).

---

## Markets

### List markets

**`GET /api/markets`**

Returns markets with basic stats (from `markets` + `market_daily_aggregates`).

| Query param | Type   | Description |
|-------------|--------|--------------|
| `platform`  | string | Filter by platform name: `pred`, `kash`, `kalshi`, `polymarket` (or platform UUID). |
| `category`  | string | Filter by category: e.g. `sports`, `politics`, `macro`, `culture`. |
| `limit`     | number | Max results (default 50, max 100). |
| `offset`    | number | Pagination offset (default 0). |
| `sort`      | string | Optional. Sort key, e.g. `health_score`, `total_volume`. When `sort=health_score`, order is by latest-day health score descending (nulls last). |

**Response**: `{ data: Market[], nextOffset: number | null }`  
Each `Market` includes: `id`, `platform_id`, `external_market_id`, `symbol`, `title`, `category`, `subcategory`, `status`, `created_at`, `platforms: { name }`, and `stats`: `{ total_volume, num_trades, unique_traders, avg_spread, health_score }`. `health_score` is a number 0–100 or `null` (latest day from `market_daily_aggregates`).

---

### Get market by ID

**`GET /api/markets/[id]`**

Returns a single market’s metadata for the detail page.

**Response**: `{ data: { id, title, symbol, category, status, platformName, health_score, health_score_date, ... } }`  
- `health_score`: number 0–100 or `null` (from latest `market_daily_aggregates` row).  
- `health_score_date`: date string (YYYY-MM-DD) of the aggregate row used for the score, or `null`.

**Errors**: `400` missing id; `404` market not found; `500` server error.

---

### Market liquidity time-series

**`GET /api/markets/[id]/liquidity`**

Time-series of `market_liquidity_snapshots` for the market.

| Query param | Type   | Description |
|-------------|--------|--------------|
| `interval`  | string | Informational (default `15m`). |
| `from`      | string | ISO timestamp (inclusive). |
| `to`        | string | ISO timestamp (inclusive). |
| `limit`     | number | Max points (default 500, max 1000). |

**Response**: `{ data: LiquidityPoint[], interval }`  
Each point: `timestamp`, `best_bid_price`, `best_ask_price`, `spread`, `spread_bps`, `depth_bid_1`, `depth_ask_1`, `depth_bid_5`, `depth_ask_5`, `volume_1h`, `trades_1h`, `unique_traders_1h`.

---

### Market participants

**`GET /api/markets/[id]/participants`**

Top wallets by volume and PnL for the market (from orders, trades, amm_trades, trader_daily_stats).

| Query param | Type   | Description |
|-------------|--------|--------------|
| `limit`     | number | Max participants (default 20, max 100). |

**Response**: `{ data: Participant[] }`  
Each participant: `wallet_id`, `address`, `volume`, `trades`, `pnl_estimate`.

---

## Social (Kash)

### Social posts and metrics by market

**`GET /api/social/[marketId]`**

Social posts, metrics, and sentiment for a Kash market (via `social_market_links`).

**Response**: `{ data: { posts: Post[], metrics: SocialMetric[], sentiment: Sentiment[] } }`  
- `posts`: id, platform, external_post_id, author_handle, created_at, text, language, url, relation_type.  
- `metrics`: social_post_id, timestamp, likes, retweets, quotes, replies, views.  
- `sentiment`: social_post_id, model_name, run_at, sentiment_score, sentiment_label.

---

## Benchmarks

### Platform headline metrics

**`GET /api/benchmarks`**

Returns platform-level metrics for Pred, Kash, Kalshi, and Polymarket over a date range (total volume, active markets, avg spread). Pred/Kash from `market_daily_aggregates`; Kalshi/Polymarket from `incumbent_daily_metrics`.

| Query param | Type   | Description |
|-------------|--------|--------------|
| `from`      | string | Start date YYYY-MM-DD (default: 30 days ago). |
| `to`        | string | End date YYYY-MM-DD (default: today). |

**Response**: `{ data: BenchmarkRow[], from, to }`  
Each row: `platformId`, `platformName`, `totalVolume`, `activeMarkets`, `avgSpreadBps` (null for incumbents if not in our schema).

---

## Export

### CSV: market daily aggregates

**`GET /api/export/market/[id]/daily`**

CSV download of `market_daily_aggregates` for the market.

| Query param | Type   | Description |
|-------------|--------|--------------|
| `from`      | string | Date YYYY-MM-DD (inclusive). |
| `to`        | string | Date YYYY-MM-DD (inclusive). |

**Response**: `text/csv` with header `Content-Disposition: attachment; filename="market-{id}-daily.csv"`.  
Columns: date, total_volume, num_trades, avg_spread, median_spread, realized_vol, max_depth_bid_5, max_depth_ask_5, unique_traders, gini_participation.

---

## Schema

Full schema reference: `.cursor/skills/liquidity-console-domain/reference.md`.
