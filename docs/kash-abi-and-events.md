# Kash – ABI and Events

**Purpose**: Document Kash chain contract(s), event shapes, and market–post linkage for the Liquidity Intelligence Console indexer.

## Chain

- **Network**: _TBD_ (confirm whether Kash AMM/markets are on Base, Ethereum, or another chain)
- **RPC**: _TBD_

## Contract address(es)

> **TODO**: Obtain from official Kash documentation or block explorer. Verify before indexing.

| Contract role | Address | Notes |
|---------------|---------|--------|
| AMM / market factory | _TBD_ | Swap, Mint, Burn, MarketCreated (or equivalent) |
| (Others if any) | _TBD_ | |

## Events to index

Kash is a social-native prediction market on X; users trade via @kash_bot with a bonding-curve AMM.

| Event name | Purpose | Key fields (for `kash_raw_events.raw_data`) |
|------------|---------|---------------------------------------------|
| MarketCreated (or equivalent) | New market | marketId, creator, outcomes, curve params |
| Swap / Trade (or equivalent) | AMM trade | marketId, user, direction (buy/sell), outcomeId, size, notional, price |
| Mint / Burn | Liquidity or position change | marketId, user, amount, etc. |

> **TODO**: Paste or link the actual ABI. Align field names with normalization job (markets, market_outcomes, wallets, amm_trades).

## ABI snippet (placeholder)

```json
[
  {
    "type": "event",
    "name": "MarketCreated",
    "inputs": [
      { "name": "marketId", "type": "bytes32", "indexed": true },
      { "name": "creator", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "Swap",
    "inputs": [
      { "name": "marketId", "type": "bytes32", "indexed": true },
      { "name": "trader", "type": "address", "indexed": true },
      { "name": "direction", "type": "uint8" },
      { "name": "outcomeId", "type": "uint256" },
      { "name": "size", "type": "uint256" },
      { "name": "notional", "type": "uint256" },
      { "name": "price", "type": "uint256" }
    ]
  }
]
```

## Market–post links (social)

- **Source**: Decide whether market ↔ X post links come from onchain (e.g. event payload or metadata), X API (e.g. @kash_bot replies), or both.
- **Storage**: `social_market_links` (market_id, social_post_id, relation_type: seed_post, reply, quote, thread).
- **X API**: If used, document scope (read-only, endpoints), rate limits, and store keys in env/secret store. See `docs/incumbent-apis.md` for pattern.

## Natural key

- Raw table: `(block_number, tx_hash, log_index)`. Idempotent insert with `ON CONFLICT DO NOTHING`.
