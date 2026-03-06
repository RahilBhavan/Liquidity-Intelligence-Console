-- Incumbent daily metrics (Kalshi/Polymarket benchmarks) and optional positions table

CREATE TABLE incumbent_daily_metrics (
  id bigserial PRIMARY KEY,
  platform_id uuid NOT NULL REFERENCES platforms(id),
  date date NOT NULL,
  metric_name text NOT NULL,
  value numeric,
  raw_response jsonb,
  UNIQUE (platform_id, date, metric_name)
);

CREATE INDEX idx_incumbent_daily_metrics_platform_date ON incumbent_daily_metrics(platform_id, date);

-- Optional: positions for deeper analysis (Pred)
CREATE TABLE positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  wallet_id uuid NOT NULL REFERENCES wallets(id),
  outcome_id uuid NOT NULL REFERENCES market_outcomes(id),
  net_size numeric NOT NULL,
  avg_entry_price numeric,
  realized_pnl numeric,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (market_id, wallet_id, outcome_id)
);

CREATE INDEX idx_positions_market ON positions(market_id);
CREATE INDEX idx_positions_wallet ON positions(wallet_id);

-- Seed platforms for Pred, Kash, and incumbents (idempotent)
INSERT INTO platforms (id, name, type, chain, is_incumbent, created_at)
VALUES
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'pred', 'onchain_orderbook', 'base', false, now()),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'kash', 'amm', 'base', false, now()),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'kalshi', 'offchain', 'ethereum', true, now()),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'polymarket', 'offchain', 'polygon', true, now())
ON CONFLICT (id) DO NOTHING;
