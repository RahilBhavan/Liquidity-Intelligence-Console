-- Liquidity Intelligence Console – Reference tables
-- platforms, markets, market_outcomes, wallets

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  chain text,
  is_incumbent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid NOT NULL REFERENCES platforms(id),
  external_market_id text NOT NULL,
  symbol text,
  title text,
  category text,
  subcategory text,
  event_start_time timestamptz,
  event_end_time timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  status text NOT NULL DEFAULT 'open',
  settlement_source text,
  base_currency text,
  leverage_supported boolean DEFAULT false,
  notes text,
  UNIQUE (platform_id, external_market_id)
);

CREATE INDEX idx_markets_platform_id ON markets(platform_id);
CREATE INDEX idx_markets_category ON markets(category);
CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_markets_created_at ON markets(created_at);

CREATE TABLE market_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  outcome_key text NOT NULL,
  description text,
  is_winning boolean,
  payout_ratio numeric,
  UNIQUE (market_id, outcome_key)
);

CREATE INDEX idx_market_outcomes_market_id ON market_outcomes(market_id);

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid NOT NULL REFERENCES platforms(id),
  address text NOT NULL,
  is_contract boolean NOT NULL DEFAULT false,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform_id, address)
);

CREATE INDEX idx_wallets_platform_id ON wallets(platform_id);
CREATE INDEX idx_wallets_address ON wallets(address);
