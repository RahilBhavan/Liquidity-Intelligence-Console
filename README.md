# Liquidity Intelligence Console

Cross-platform console that ingests, normalizes, and analyzes event-level data from **Pred** (Base order-book) and **Kash** (social AMM on X), with incumbent benchmarks (Kalshi/Polymarket). Exposes liquidity, market-quality, and behavior metrics via a web dashboard and exportable artifacts.

## Stack

- **Database**: Postgres (Supabase)
- **API + UI**: Next.js App Router (API routes + dashboard)
- **Ingestion**: TypeScript workers (viem + Supabase)
- **Analytics**: SQL/TypeScript jobs for aggregates
- **Tooling**: Bun

## Setup

0. **Secrets**: Copy `.env.example` to `.env` and fill in your values. Do not commit `.env` or real API keys.

1. **Supabase**: Create a project, run migrations, set env vars.
   ```bash
   cd supabase && supabase link  # or apply migrations via Dashboard
   ```
   Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY`) and for dashboard `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **Install**
   ```bash
   bun install
   ```

3. **Apply migrations**
   ```bash
   bun run db:migrate
   ```
   Requires `supabase link` (or use a linked project). Or apply `supabase/migrations/*.sql` manually in the Supabase SQL editor.

4. **Ingestion** (set contract addresses and RPC in env first; see `docs/pred-abi-and-events.md`, `docs/kash-abi-and-events.md`):
   ```bash
   PRED_EXCHANGE_ADDRESS=0x... BASE_RPC_URL=... bun run ingest:pred
   KASH_AMM_ADDRESS=0x... bun run ingest:kash
   bun run ingest:incumbent
   bun run normalize
   ```

5. **Analytics** (normalize first, then run all analytics in one go)
   ```bash
   bun run pipeline
   ```
   Or step by step: `bun run normalize` then `bun run analytics:daily`, `bun run analytics:snapshots`, `bun run analytics:trader`.  
   To backfill market_daily_aggregates for a date range: `BACKFILL_FROM=2025-01-01 BACKFILL_TO=2025-01-31 bun run analytics:backfill`.

6. **Apply everything** (migrations + full pipeline)
   ```bash
   bun run apply
   ```
   Use after ingestion has populated raw tables; runs `db:migrate` then `pipeline`.

7. **Apply remaining steps (checklist)**  
   Run in order: (1) `bun run db:migrate`, (2) start indexers and/or run `ingest:incumbent`, (3) `bun run normalize`, (4) `bun run pipeline`. Then start the dashboard with `bun run dev`.

8. **Dashboard**
   ```bash
   bun run dev
   ```
   Open http://localhost:3000.

**Quick demo**: To see the UI without running ingestion, run `bun run dev` and open [http://localhost:3000/markets](http://localhost:3000/markets). The list may be empty until ingestion and the pipeline have run.

### Deploy to Vercel

1. **Root Directory**: In the Vercel project settings, set **Root Directory** to `apps/dashboard` (monorepo).
2. **Build**: Vercel will run `next build` from that root; no extra config needed.
3. **Environment variables**: Add in Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
   - Optionally `SUPABASE_SERVICE_ROLE_KEY` for server-only export features
4. The dashboard uses `vercel.json` in `apps/dashboard` for caching headers and security; API list/status/benchmarks revalidate every 30–60s.

**Ready to show**: Run `bun run dev`, open the app at http://localhost:3000, and use **Markets**, **Benchmarks**, and **Docs** (header). For the full narrative, use the [example founder deck](docs/consulting/example-founder-deck.md).

## Documentation

- **[Methodology & metrics](docs/METHODOLOGY.md)** — How spreads, depth, Gini, and volume are defined and computed; data freshness.
- **[API reference](docs/API.md)** — Endpoints, query params, and response shapes.
- **[Data and privacy](docs/DATA_AND_PRIVACY.md)** — What data is stored and how it is handled.

## Repository layout

- `apps/dashboard` – Next.js app (API routes + Overview, Market explorer, Participant view, Social view, CSV export)
- `packages/db` – Supabase client
- `packages/ingestion/pred-indexer` – Pred chain indexer
- `packages/ingestion/kash-indexer` – Kash chain indexer
- `packages/ingestion/incumbent-collector` – Kalshi/Polymarket API collector
- `packages/ingestion/normalize` – Raw → normalized (markets, orders, trades, amm_trades)
- `packages/analytics/market-daily` – market_daily_aggregates
- `packages/analytics/liquidity-snapshots` – market_liquidity_snapshots
- `packages/analytics/trader-daily` – trader_daily_stats
- `supabase/migrations` – Schema DDL
- `docs/` – Recon (Pred/Kash/incumbent APIs), consulting drafts, deck template

## API

See **[docs/API.md](docs/API.md)** for the full reference. Summary:

- `GET /api/markets?platform=pred&category=sports` – list markets with stats
- `GET /api/markets/[id]/liquidity?interval=15m` – liquidity time-series
- `GET /api/markets/[id]/participants` – top wallets by volume
- `GET /api/social/[marketId]` – social posts and metrics for Kash
- `GET /api/export/market/[id]/daily` – CSV download

## Consulting artifacts

- **[Example founder deck](docs/consulting/example-founder-deck.md)** — Full narrative with traceable metrics (for demos/pitches).
- `docs/consulting/pred-liquidity-diagnostic.md`
- `docs/consulting/kash-social-liquidity-report.md`
- `docs/consulting/incumbent-benchmarking.md`
- `docs/consulting/deck-template.md`

Schema reference: `.cursor/skills/liquidity-console-domain/reference.md`.
