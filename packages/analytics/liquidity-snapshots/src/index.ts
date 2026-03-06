/**
 * market_liquidity_snapshots: periodic snapshots (e.g. every 15 min) of best bid/ask,
 * spread, depth, volume_1h, trades_1h, unique_traders_1h per market.
 */
import { supabase } from "@lic/db";

const SNAPSHOT_INTERVAL_MINUTES = 15;

async function run(): Promise<void> {
  const now = new Date();
  const ts = new Date(now.getTime() - (now.getTime() % (SNAPSHOT_INTERVAL_MINUTES * 60 * 1000))).toISOString();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  const { data: markets } = await supabase.from("markets").select("id, platform_id").eq("status", "open");
  if (!markets?.length) {
    console.log("No open markets.");
    return;
  }

  const rows: Record<string, unknown>[] = [];

  for (const m of markets) {
    const { data: orders } = await supabase
      .from("orders")
      .select("side, price, remaining_size")
      .eq("market_id", m.id)
      .eq("status", "open");

    const bids = (orders ?? []).filter((o) => o.side === "buy").sort((a, b) => Number(b.price) - Number(a.price));
    const asks = (orders ?? []).filter((o) => o.side === "sell").sort((a, b) => Number(a.price) - Number(b.price));
    const bestBid = bids[0] ? Number(bids[0].price) : null;
    const bestAsk = asks[0] ? Number(asks[0].price) : null;
    const spread = bestBid != null && bestAsk != null ? bestAsk - bestBid : null;
    const spreadBps = spread != null && bestBid ? (spread / bestBid) * 10000 : null;
    const depthBid1 = bids[0] ? Number(bids[0].remaining_size) : null;
    const depthAsk1 = asks[0] ? Number(asks[0].remaining_size) : null;
    const depthBid5 = bids.slice(0, 5).reduce((s, o) => s + Number(o.remaining_size), 0) || null;
    const depthAsk5 = asks.slice(0, 5).reduce((s, o) => s + Number(o.remaining_size), 0) || null;

    const { data: trades1hData } = await supabase
      .from("trades")
      .select("price, size, buy_order_id")
      .eq("market_id", m.id)
      .gte("timestamp", oneHourAgo)
      .lte("timestamp", now.toISOString());

    let volume1h = 0;
    let trades1hCount = 0;
    const walletIds = new Set<string>();
    if (trades1hData?.length) {
      for (const t of trades1hData) {
        volume1h += Number(t.price) * Number(t.size);
        trades1hCount += 1;
      }
      const orderIds = [...new Set(trades1hData.flatMap((t) => [t.buy_order_id]).filter(Boolean))];
      for (const oid of orderIds) {
        const { data: ord } = await supabase.from("orders").select("wallet_id").eq("id", oid).single();
        if (ord?.wallet_id) walletIds.add(ord.wallet_id);
      }
    }

    rows.push({
      market_id: m.id,
      platform_id: m.platform_id,
      timestamp: ts,
      best_bid_price: bestBid,
      best_ask_price: bestAsk,
      spread,
      spread_bps: spreadBps,
      depth_bid_1: depthBid1,
      depth_ask_1: depthAsk1,
      depth_bid_5: depthBid5,
      depth_ask_5: depthAsk5,
      volume_1h: volume1h,
      trades_1h: trades1hCount,
      unique_traders_1h: walletIds.size,
    });
  }

  const { error } = await supabase.from("market_liquidity_snapshots").insert(rows);
  if (error) throw error;
  console.log("Inserted", rows.length, "market_liquidity_snapshots at", ts);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
