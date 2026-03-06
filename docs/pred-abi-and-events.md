# Pred (Base) – ABI and Events

**Purpose**: Document Pred exchange contract address(es), chain, and event shapes for the Liquidity Intelligence Console indexer.

## Chain

- **Network**: Base (chainId: 8453)
- **RPC**: Use a Base RPC (e.g. public, Alchemy, QuickNode). See `.cursor/ethskills/tools.md` for RPC patterns.

## Contract address(es)

> **TODO**: Obtain from official Pred documentation or Base block explorer. Do not guess. Verify on [basescan.org](https://basescan.org) before indexing.

| Contract role | Address | Notes |
|---------------|---------|--------|
| Exchange / order book | _TBD_ | Primary contract emitting order and trade events |

## Events to index

Pred is a Base-native order-book sports prediction exchange (200 ms execution, sub-2% spreads). The indexer must decode and store:

| Event name | Purpose | Key fields (to store in `pred_raw_events.raw_data`) |
|------------|---------|-----------------------------------------------------|
| OrderPlaced (or equivalent) | New limit order | orderId, marketId, maker, side, price, size, timestamp |
| Trade (or equivalent) | Execution | tradeId, buyOrderId, sellOrderId, price, size, takerSide |
| OrderCancelled (or equivalent) | Cancel | orderId, marketId |

> **TODO**: Paste or link the actual ABI for the exchange contract. Ensure event names and argument names match what the normalization job expects.

## ABI snippet (placeholder)

Replace with the real ABI from Pred docs or block explorer (Contract → Code → ABI).

```json
[
  {
    "type": "event",
    "name": "OrderPlaced",
    "inputs": [
      { "name": "orderId", "type": "bytes32", "indexed": true },
      { "name": "marketId", "type": "bytes32", "indexed": true },
      { "name": "maker", "type": "address", "indexed": true },
      { "name": "side", "type": "uint8" },
      { "name": "price", "type": "uint256" },
      { "name": "size", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "Trade",
    "inputs": [
      { "name": "tradeId", "type": "bytes32", "indexed": true },
      { "name": "marketId", "type": "bytes32", "indexed": true },
      { "name": "buyOrderId", "type": "bytes32", "indexed": true },
      { "name": "sellOrderId", "type": "bytes32", "indexed": true },
      { "name": "price", "type": "uint256" },
      { "name": "size", "type": "uint256" },
      { "name": "takerSide", "type": "uint8" }
    ]
  }
]
```

## Natural key for idempotency

- Raw table: `(block_number, tx_hash, log_index)` — unique per event. Use `ON CONFLICT DO NOTHING` when inserting.

## Reorg handling

- Optional: treat blocks as confirmed only after N blocks (e.g. 12 on Base). On reorg, soft-delete or update affected rows; keep raw table append-only where possible.
