-- Unified fact tables: liquidity snapshots, daily aggregates, trader daily stats

CREATE TABLE market_liquidity_snapshots (
  id bigserial,
  market_id uuid NOT NULL REFERENCES markets(id),
  platform_id uuid NOT NULL REFERENCES platforms(id),
  timestamp timestamptz NOT NULL,
  best_bid_price numeric,
  best_ask_price numeric,
  spread numeric,
  spread_bps numeric,
  depth_bid_1 numeric,
  depth_ask_1 numeric,
  depth_bid_5 numeric,
  depth_ask_5 numeric,
  volume_1h numeric,
  trades_1h int,
  unique_traders_1h int,
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE TABLE market_liquidity_snapshots_default PARTITION OF market_liquidity_snapshots DEFAULT;

CREATE INDEX idx_market_liquidity_snapshots_market_time ON market_liquidity_snapshots(market_id, timestamp);
CREATE INDEX idx_market_liquidity_snapshots_platform_time ON market_liquidity_snapshots(platform_id, timestamp);

CREATE TABLE market_daily_aggregates (
  id bigserial PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES markets(id),
  platform_id uuid NOT NULL REFERENCES platforms(id),
  date date NOT NULL,
  total_volume numeric NOT NULL DEFAULT 0,
  num_trades int NOT NULL DEFAULT 0,
  avg_spread numeric,
  median_spread numeric,
  realized_vol numeric,
  max_depth_bid_5 numeric,
  max_depth_ask_5 numeric,
  unique_traders int NOT NULL DEFAULT 0,
  gini_participation numeric,
  UNIQUE (market_id, date)
);

CREATE INDEX idx_market_daily_aggregates_market_date ON market_daily_aggregates(market_id, date);
CREATE INDEX idx_market_daily_aggregates_platform_date ON market_daily_aggregates(platform_id, date);
CREATE INDEX idx_market_daily_aggregates_date ON market_daily_aggregates(date);

CREATE TABLE trader_daily_stats (
  id bigserial PRIMARY KEY,
  wallet_id uuid NOT NULL REFERENCES wallets(id),
  platform_id uuid NOT NULL REFERENCES platforms(id),
  date date NOT NULL,
  num_trades int NOT NULL DEFAULT 0,
  maker_volume numeric NOT NULL DEFAULT 0,
  taker_volume numeric NOT NULL DEFAULT 0,
  amm_volume numeric NOT NULL DEFAULT 0,
  pnl_estimate numeric,
  UNIQUE (wallet_id, platform_id, date)
);

CREATE INDEX idx_trader_daily_stats_wallet_date ON trader_daily_stats(wallet_id, date);
CREATE INDEX idx_trader_daily_stats_platform_date ON trader_daily_stats(platform_id, date);
