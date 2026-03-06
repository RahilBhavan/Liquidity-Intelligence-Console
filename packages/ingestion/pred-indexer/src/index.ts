/**
 * Pred (Base) indexer: fetches exchange events and writes to pred_raw_events.
 * Idempotent via (block_number, tx_hash, log_index) unique constraint.
 */
import { createPublicClient, http, decodeEventLog, type Log } from "viem";
import { base } from "viem/chains";
import { supabase } from "@lic/db";

const PRED_EXCHANGE_ADDRESS = process.env.PRED_EXCHANGE_ADDRESS as `0x${string}`;
const BASE_RPC_URL = process.env.BASE_RPC_URL ?? "https://mainnet.base.org";
const CHUNK_SIZE = 2_000n;
const POLL_INTERVAL_MS = 15_000;

if (!PRED_EXCHANGE_ADDRESS) {
  throw new Error("PRED_EXCHANGE_ADDRESS must be set");
}

const client = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});

/** Placeholder ABI: replace with actual Pred event definitions from docs/pred-abi-and-events.md */
const predAbi = [
  {
    type: "event",
    name: "OrderPlaced",
    inputs: [
      { name: "orderId", type: "bytes32", indexed: true },
      { name: "marketId", type: "bytes32", indexed: true },
      { name: "maker", type: "address", indexed: true },
      { name: "side", type: "uint8" },
      { name: "price", type: "uint256" },
      { name: "size", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Trade",
    inputs: [
      { name: "tradeId", type: "bytes32", indexed: true },
      { name: "marketId", type: "bytes32", indexed: true },
      { name: "buyOrderId", type: "bytes32", indexed: true },
      { name: "sellOrderId", type: "bytes32", indexed: true },
      { name: "price", type: "uint256" },
      { name: "size", type: "uint256" },
      { name: "takerSide", type: "uint8" },
    ],
  },
  {
    type: "event",
    name: "OrderCancelled",
    inputs: [
      { name: "orderId", type: "bytes32", indexed: true },
      { name: "marketId", type: "bytes32", indexed: true },
    ],
  },
] as const;

function getLastIndexedBlock(): Promise<bigint> {
  return supabase
    .from("pred_raw_events")
    .select("block_number")
    .order("block_number", { ascending: false })
    .limit(1)
    .single()
    .then(({ data }) => (data?.block_number ? BigInt(data.block_number) : 0n));
}

function logToRawRow(log: Log, blockTimestamp: Date): Record<string, unknown> {
  let eventName = "Unknown";
  let decodedArgs: Record<string, unknown> = {};
  try {
    const decoded = decodeEventLog({ abi: predAbi, data: log.data, topics: log.topics });
    eventName = decoded.eventName;
    decodedArgs = decoded.args as Record<string, unknown>;
  } catch {
    decodedArgs = { topics: log.topics, data: log.data };
  }
  return {
    block_number: Number(log.blockNumber),
    tx_hash: log.transactionHash,
    log_index: log.logIndex,
    event_name: eventName,
    contract_addr: log.address,
    raw_data: decodedArgs,
    timestamp: blockTimestamp.toISOString(),
    ingested_at: new Date().toISOString(),
  };
}

async function indexRange(fromBlock: bigint, toBlock: bigint): Promise<number> {
  const logs = await client.getLogs({
    address: PRED_EXCHANGE_ADDRESS,
    fromBlock,
    toBlock,
  });

  if (logs.length === 0) return 0;

  const blockTimestamps = new Map<bigint, Date>();
  const blocks = [...new Set(logs.map((l) => l.blockNumber!))];
  for (const blockNum of blocks) {
    const block = await client.getBlock({ blockNumber: blockNum });
    blockTimestamps.set(blockNum, new Date(Number(block.timestamp) * 1000));
  }

  const rows = logs.map((log) =>
    logToRawRow(log, blockTimestamps.get(log.blockNumber!) ?? new Date())
  );

  const { error } = await supabase.from("pred_raw_events").upsert(rows, {
    onConflict: "block_number,tx_hash,log_index",
    ignoreDuplicates: true,
  });

  if (error) throw error;
  return rows.length;
}

async function run(): Promise<void> {
  let lastBlock = await getLastIndexedBlock();
  const latestBlock = await client.getBlockNumber();
  if (lastBlock === 0n) {
    lastBlock = latestBlock - 10000n;
    if (lastBlock < 0n) lastBlock = 0n;
  }

  while (lastBlock < latestBlock) {
    const toBlock = lastBlock + CHUNK_SIZE < latestBlock ? lastBlock + CHUNK_SIZE : latestBlock;
    const count = await indexRange(lastBlock + 1n, toBlock);
    console.log(`Indexed ${count} events for blocks ${lastBlock + 1n}-${toBlock}`);
    lastBlock = toBlock;
  }

  console.log("Caught up. Polling for new blocks every", POLL_INTERVAL_MS, "ms");
  setInterval(async () => {
    const latest = await client.getBlockNumber();
    if (latest <= lastBlock) return;
    const count = await indexRange(lastBlock + 1n, latest);
    if (count > 0) console.log(`Indexed ${count} new events`);
    lastBlock = latest;
  }, POLL_INTERVAL_MS);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
