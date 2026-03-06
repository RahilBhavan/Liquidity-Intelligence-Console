# Data and Privacy

Short note on how the Liquidity Intelligence Console handles data.

- **Storage**: All application data is stored in Postgres (Supabase). No data is sent to third parties for analytics or advertising.
- **Data types**: The console uses (1) **on-chain data** (addresses, transactions, order book and AMM events from Pred and Kash), and (2) **API-sourced data** (Kalshi, Polymarket, and where applicable public social post IDs and engagement metrics). Wallet addresses and transaction hashes are public on-chain. Social handles and post content are only stored when they are already public (e.g. posts linked to Kash markets).
- **PII**: We do not collect or store personally identifiable information beyond what is already public (e.g. on-chain addresses, public social handles). No passwords or private keys are ever stored.
- **Secrets**: API keys, RPC URLs, and Supabase credentials are configured via environment variables (or a secret store) and are never committed to the repository.
- **Sharing**: We do not share data with third parties. The dashboard and API are for your own use or for stakeholders you choose to share access with (e.g. via deployed URL and optional auth).

For methodology and metric definitions, see [METHODOLOGY.md](./METHODOLOGY.md). For API usage, see [API.md](./API.md).
