# Incumbent APIs – Kalshi / Polymarket

**Purpose**: Document public API endpoints for Kalshi and Polymarket used for benchmark aggregates in the Liquidity Intelligence Console. Both are ingested by the incumbent collector (`bun run ingest:incumbent`).

## Storage

- **Table**: `incumbent_daily_metrics (platform_id, date, metric_name, value, raw_response jsonb)`.
- **Metrics ingested**: `active_markets_count`, `volume_24h` (per platform per day).
- **Platform IDs** (from migration seed): Kalshi `a0000000-0000-4000-8000-000000000003`, Polymarket `a0000000-0000-4000-8000-000000000004`.

## Kalshi

- **Base URL**: `https://api.elections.kalshi.com/trade-api/v2` (production). Override with `KALSHI_API_BASE` in env.
- **Auth**: Public market data endpoints do not require an API key.

| Endpoint | Purpose | Notes |
|----------|---------|------|
| `GET /markets?status=open&limit=200&cursor=...` | Open markets list; paginated | Used to count active markets and sum `volume_24h` per market. |
| Response | `{ markets: Market[], cursor?: string }` | Each market has `volume`, `volume_24h`, `volume_fp`, `volume_24h_fp`, `ticker`, `status`. |

- **Collector behavior**: Paginates with `cursor`; sums `volume_24h` (or `volume_24h_fp`) across open markets; writes `active_markets_count` and `volume_24h` into `incumbent_daily_metrics`.

## Polymarket

- **Base URL**: `https://gamma-api.polymarket.com`. Override with `POLYMARKET_API_BASE` in env.
- **Auth**: Public; no key required for events/markets.

| Endpoint | Purpose | Notes |
|----------|---------|------|
| `GET /events?active=true&closed=false&limit=100&offset=...&order=volume_24hr&ascending=false` | Active events (markets) | Used to count active events and sum 24h volume. |
| Response | `Event[]` | Each event has `volume`, `volume_24hr`, `id`, `slug`, `title`, `active`, `closed`, `markets`. |

- **Collector behavior**: Paginates with `offset`; sums `volume_24hr` (or `volume`) across active events; writes `active_markets_count` and `volume_24h` into `incumbent_daily_metrics`.

## Env vars (optional)

- `KALSHI_API_BASE` – default `https://api.elections.kalshi.com/trade-api/v2`
- `POLYMARKET_API_BASE` – default `https://gamma-api.polymarket.com`

Store in `.env`; never commit keys. No API keys needed for the current public market/events endpoints.

## Rate limits

- Document per-provider limits when known. Use conservative polling for cron (e.g. daily run).

## Run ingestion

```bash
bun run ingest:incumbent
```

Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in env (see `.env.example`).
