-- Kash – raw events, AMM trades, social posts and metrics

CREATE TABLE kash_raw_events (
  id bigserial PRIMARY KEY,
  block_number bigint NOT NULL,
  tx_hash text NOT NULL,
  log_index int NOT NULL,
  event_name text NOT NULL,
  contract_addr text NOT NULL,
  raw_data jsonb NOT NULL,
  timestamp timestamptz NOT NULL,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (block_number, tx_hash, log_index)
);

CREATE INDEX idx_kash_raw_events_timestamp ON kash_raw_events(timestamp);
CREATE INDEX idx_kash_raw_events_block_number ON kash_raw_events(block_number);

CREATE TABLE amm_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  wallet_id uuid NOT NULL REFERENCES wallets(id),
  direction text NOT NULL,
  outcome_id uuid REFERENCES market_outcomes(id),
  price numeric NOT NULL,
  size numeric NOT NULL,
  notional numeric NOT NULL,
  tx_hash text NOT NULL,
  timestamp timestamptz NOT NULL,
  fee_amount numeric
);

CREATE INDEX idx_amm_trades_market_timestamp ON amm_trades(market_id, timestamp);
CREATE INDEX idx_amm_trades_wallet_timestamp ON amm_trades(wallet_id, timestamp);

CREATE TABLE social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL DEFAULT 'x',
  external_post_id text NOT NULL,
  author_handle text,
  author_id text,
  created_at timestamptz NOT NULL,
  text text,
  language text,
  url text,
  UNIQUE (platform, external_post_id)
);

CREATE INDEX idx_social_posts_platform_external ON social_posts(platform, external_post_id);

CREATE TABLE social_metrics (
  id bigserial,
  social_post_id uuid NOT NULL REFERENCES social_posts(id),
  timestamp timestamptz NOT NULL,
  likes int NOT NULL DEFAULT 0,
  retweets int NOT NULL DEFAULT 0,
  quotes int NOT NULL DEFAULT 0,
  replies int NOT NULL DEFAULT 0,
  views bigint,
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE TABLE social_metrics_default PARTITION OF social_metrics DEFAULT;

CREATE INDEX idx_social_metrics_post_timestamp ON social_metrics(social_post_id, timestamp);

CREATE TABLE social_market_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  social_post_id uuid NOT NULL REFERENCES social_posts(id),
  relation_type text NOT NULL
);

CREATE INDEX idx_social_market_links_market ON social_market_links(market_id);
CREATE INDEX idx_social_market_links_post ON social_market_links(social_post_id);

CREATE TABLE social_sentiment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_post_id uuid NOT NULL REFERENCES social_posts(id),
  model_name text,
  run_at timestamptz NOT NULL,
  sentiment_score numeric,
  sentiment_label text,
  topic_vector jsonb
);

CREATE INDEX idx_social_sentiment_post ON social_sentiment(social_post_id);
