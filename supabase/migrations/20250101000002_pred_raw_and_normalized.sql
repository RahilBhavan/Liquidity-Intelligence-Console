-- Pred (Base) – raw events and normalized orders, trades

CREATE TABLE pred_raw_events (
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

CREATE INDEX idx_pred_raw_events_timestamp ON pred_raw_events(timestamp);
CREATE INDEX idx_pred_raw_events_block_number ON pred_raw_events(block_number);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  wallet_id uuid NOT NULL REFERENCES wallets(id),
  side text NOT NULL,
  price numeric NOT NULL,
  size numeric NOT NULL,
  remaining_size numeric NOT NULL DEFAULT 0,
  status text NOT NULL,
  placed_at timestamptz NOT NULL,
  cancelled_at timestamptz,
  source_event_id bigint REFERENCES pred_raw_events(id)
);

CREATE INDEX idx_orders_market_side_price ON orders(market_id, side, price);
CREATE INDEX idx_orders_wallet_placed_at ON orders(wallet_id, placed_at);
CREATE INDEX idx_orders_market_id ON orders(market_id);

CREATE TABLE trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid NOT NULL REFERENCES markets(id),
  buy_order_id uuid NOT NULL REFERENCES orders(id),
  sell_order_id uuid NOT NULL REFERENCES orders(id),
  price numeric NOT NULL,
  size numeric NOT NULL,
  taker_side text NOT NULL,
  tx_hash text NOT NULL,
  timestamp timestamptz NOT NULL,
  fee_amount numeric
);

CREATE INDEX idx_trades_market_timestamp ON trades(market_id, timestamp);
CREATE INDEX idx_trades_timestamp ON trades(timestamp);
