# Liquidity Console – Full Schema Reference

Column lists aligned with project spec §5. Adapt to your SQL dialect (e.g. Supabase/Postgres).

## Core Reference

### platforms
| Column     | Type       | Notes                          |
|-----------|------------|--------------------------------|
| id        | uuid (PK)  | Internal platform ID           |
| name      | text       | e.g. pred, kash, polymarket, kalshi |
| type      | text       | onchain_orderbook, amm, offchain |
| chain     | text       | e.g. base, ethereum, polygon   |
| is_incumbent | boolean | true for Kalshi/Polymarket    |
| created_at | timestamptz |                             |

### markets
| Column            | Type        | Notes                          |
|-------------------|-------------|--------------------------------|
| id                | uuid (PK)   | Internal market ID             |
| platform_id       | uuid (FK)   | References platforms.id        |
| external_market_id| text        | Platform native ID             |
| symbol            | text        | e.g. NFL_GAME_123_WIN          |
| title             | text        | Display title / question       |
| category          | text        | sports, politics, macro, culture |
| subcategory       | text        | NFL, EPL, US_election, etc.    |
| event_start_time  | timestamptz |                                |
| event_end_time    | timestamptz |                                |
| created_at        | timestamptz |                                |
| resolved_at       | timestamptz | null if open                   |
| status            | text        | open, closed, settled, void    |
| settlement_source  | text        | oracle, AI+ZK, admin, external_feed |
| base_currency     | text        | e.g. USDC, ETH, KASH          |
| leverage_supported| boolean     |                                |
| notes             | text        | Free-form or JSON              |

### market_outcomes
| Column      | Type       | Notes                |
|-------------|------------|----------------------|
| id          | uuid (PK)  |                      |
| market_id   | uuid (FK)  |                      |
| outcome_key | text       | YES, NO, HOME, AWAY  |
| description | text       | Optional             |
| is_winning  | boolean    | Set post-resolution  |
| payout_ratio| numeric    | Payout per 1 unit    |

### wallets
| Column       | Type        | Notes              |
|--------------|-------------|--------------------|
| id           | uuid (PK)   |                    |
| platform_id  | uuid        |                    |
| address      | text        | On-chain or user ID |
| is_contract  | boolean     |                    |
| first_seen_at| timestamptz |                    |

## Pred Raw & Normalized

### pred_raw_events
| Column      | Type        | Notes                    |
|-------------|-------------|--------------------------|
| id          | bigserial (PK) |                         |
| block_number| bigint      |                          |
| tx_hash     | text        |                          |
| log_index   | int         | Within transaction       |
| event_name  | text        | OrderPlaced, Trade, etc. |
| contract_addr | text     |                          |
| raw_data    | jsonb       | Decoded payload          |
| timestamp   | timestamptz | Block timestamp        |
| ingested_at | timestamptz |                          |

### orders
| Column         | Type        | Notes                    |
|----------------|-------------|--------------------------|
| id             | uuid (PK)   |                          |
| market_id      | uuid (FK)   |                          |
| wallet_id      | uuid (FK)   |                          |
| side           | text        | buy, sell                |
| price          | numeric     | Quote units              |
| size           | numeric     |                          |
| remaining_size | numeric     | 0 if filled/cancelled    |
| status         | text        | open, partially_filled, filled, cancelled |
| placed_at      | timestamptz |                          |
| cancelled_at   | timestamptz | Nullable                 |
| source_event_id| bigint      | FK pred_raw_events.id    |

### trades
| Column       | Type        | Notes   |
|--------------|-------------|--------|
| id           | uuid (PK)   |        |
| market_id    | uuid (FK)   |        |
| buy_order_id | uuid (FK)   |        |
| sell_order_id| uuid (FK)   |        |
| price        | numeric     |        |
| size         | numeric     |        |
| taker_side   | text        | buy, sell |
| tx_hash      | text        |        |
| timestamp    | timestamptz |        |
| fee_amount   | numeric     | Optional |

### positions (optional)
| Column         | Type        | Notes   |
|----------------|-------------|--------|
| id             | uuid (PK)   |        |
| market_id      | uuid (FK)   |        |
| wallet_id      | uuid (FK)   |        |
| outcome_id     | uuid (FK)   |        |
| net_size       | numeric     |        |
| avg_entry_price| numeric     |        |
| realized_pnl   | numeric     | Optional |
| updated_at     | timestamptz |        |

## Kash Raw, AMM, Social

### kash_raw_events
Same shape as pred_raw_events (id, block_number, tx_hash, log_index, event_name, contract_addr, raw_data, timestamp, ingested_at).

### amm_trades
| Column    | Type        | Notes              |
|-----------|-------------|--------------------|
| id        | uuid (PK)   |                    |
| market_id | uuid (FK)   |                    |
| wallet_id | uuid (FK)   |                    |
| direction | text        | buy_shares, sell_shares |
| outcome_id| uuid (FK)   |                    |
| price     | numeric     | Implied from curve  |
| size      | numeric     | Shares             |
| notional  | numeric     | Base currency      |
| tx_hash   | text        |                    |
| timestamp | timestamptz |                    |
| fee_amount| numeric     | Optional           |

### social_posts
| Column          | Type        | Notes     |
|-----------------|-------------|-----------|
| id              | uuid (PK)   |           |
| platform        | text        | x         |
| external_post_id| text       | X tweet ID |
| author_handle   | text        | @username |
| author_id       | text        | Numeric X ID |
| created_at      | timestamptz |           |
| text            | text        |           |
| language        | text        | ISO       |
| url             | text        | Optional  |

### social_metrics
| Column        | Type        | Notes          |
|---------------|-------------|----------------|
| id            | bigserial (PK) |               |
| social_post_id| uuid (FK)   |               |
| timestamp     | timestamptz | Snapshot time  |
| likes         | int         |                |
| retweets      | int         |                |
| quotes        | int         |                |
| replies       | int         |                |
| views         | bigint      | Optional       |

Partition by date for scale.

### social_market_links
| Column        | Type     | Notes                    |
|---------------|----------|--------------------------|
| id            | uuid (PK)|                          |
| market_id     | uuid (FK)|                          |
| social_post_id| uuid     |                          |
| relation_type| text     | seed_post, reply, quote, thread |

### social_sentiment (optional)
| Column         | Type        | Notes        |
|----------------|-------------|--------------|
| id             | uuid (PK)   |              |
| social_post_id | uuid (FK)   |              |
| model_name     | text        | e.g. gpt-4.1-mini |
| run_at         | timestamptz |              |
| sentiment_score| numeric     | e.g. [-1, 1] |
| sentiment_label| text        | bearish, neutral, bullish |
| topic_vector   | jsonb       | Optional     |

## Unified Fact Tables

### market_liquidity_snapshots
| Column        | Type        | Notes              |
|---------------|-------------|--------------------|
| id            | bigserial (PK) |                   |
| market_id     | uuid (FK)   |                    |
| platform_id   | uuid (FK)   |                    |
| timestamp     | timestamptz |                    |
| best_bid_price| numeric     |                    |
| best_ask_price| numeric     |                    |
| spread        | numeric     |                    |
| spread_bps    | numeric     |                    |
| depth_bid_1   | numeric     |                    |
| depth_ask_1   | numeric     |                    |
| depth_bid_5   | numeric     |                    |
| depth_ask_5   | numeric     |                    |
| volume_1h     | numeric     | Rolling            |
| trades_1h     | int         |                    |
| unique_traders_1h | int     |                    |

### market_daily_aggregates
| Column           | Type        | Notes   |
|------------------|-------------|--------|
| id               | bigserial (PK) |       |
| market_id        | uuid (FK)   |        |
| platform_id      | uuid (FK)   |        |
| date             | date        |        |
| total_volume     | numeric     |        |
| num_trades       | int         |        |
| avg_spread       | numeric     |        |
| median_spread    | numeric     |        |
| realized_vol     | numeric     |        |
| max_depth_bid_5  | numeric     |        |
| max_depth_ask_5  | numeric     |        |
| unique_traders   | int         |        |
| gini_participation | numeric  |        |

### trader_daily_stats
| Column       | Type        | Notes   |
|--------------|-------------|--------|
| id           | bigserial (PK) |     |
| wallet_id    | uuid (FK)   |        |
| platform_id  | uuid (FK)   |        |
| date         | date        |        |
| num_trades   | int         |        |
| maker_volume | numeric     | Pred    |
| taker_volume | numeric     | Pred    |
| amm_volume   | numeric     | Kash    |
| pnl_estimate | numeric     | Optional |
