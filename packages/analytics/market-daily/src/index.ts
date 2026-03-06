/**
 * market_daily_aggregates pipeline: compute per (market_id, date) from trades and amm_trades.
 * Upsert by (market_id, date). Run daily or backfill.
 */
import { supabase } from "@lic/db";

async function runForDate(date: string): Promise<void> {
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59.999Z`;

  const { data: trades, error: te } = await supabase
    .from("trades")
    .select("market_id, price, size, buy_order_id, sell_order_id, timestamp")
    .gte("timestamp", start)
    .lt("timestamp", end);

  if (te) throw te;

  const { data: ammTrades, error: ae } = await supabase
    .from("amm_trades")
    .select("market_id, wallet_id, notional, timestamp")
    .gte("timestamp", start)
    .lt("timestamp", end);

  if (ae) throw ae;

  const orderIds = [...new Set((trades ?? []).flatMap((t) => [t.buy_order_id, t.sell_order_id]).filter(Boolean))];
  const orderIdToWallet = new Map<string, string>();
  if (orderIds.length > 0) {
    const { data: orders } = await supabase.from("orders").select("id, wallet_id").in("id", orderIds);
    for (const o of orders ?? []) {
      if (o.wallet_id) orderIdToWallet.set(o.id, o.wallet_id);
    }
  }

  const marketIds = [...new Set([...(trades ?? []).map((t) => t.market_id), ...(ammTrades ?? []).map((t) => t.market_id)])];
  const marketIdToPlatform = new Map<string, string>();
  if (marketIds.length > 0) {
    const { data: markets } = await supabase.from("markets").select("id, platform_id").in("id", marketIds);
    for (const m of markets ?? []) {
      if (m.platform_id) marketIdToPlatform.set(m.id, m.platform_id);
    }
  }

  const byMarket = new Map<
    string,
    { platform_id: string; volume: number; num_trades: number; unique_traders: Set<string> }
  >();

  function ensureMarket(key: string) {
    if (!byMarket.has(key)) {
      byMarket.set(key, {
        platform_id: marketIdToPlatform.get(key) ?? "",
        volume: 0,
        num_trades: 0,
        unique_traders: new Set(),
      });
    }
  }

  for (const t of trades ?? []) {
    const key = t.market_id;
    ensureMarket(key);
    const row = byMarket.get(key)!;
    row.volume += Number(t.price) * Number(t.size);
    row.num_trades += 1;
    const buyWallet = orderIdToWallet.get(t.buy_order_id);
    const sellWallet = orderIdToWallet.get(t.sell_order_id);
    if (buyWallet) row.unique_traders.add(buyWallet);
    if (sellWallet) row.unique_traders.add(sellWallet);
  }

  for (const t of ammTrades ?? []) {
    const key = t.market_id;
    ensureMarket(key);
    const row = byMarket.get(key)!;
    row.volume += Number(t.notional);
    row.num_trades += 1;
    if (t.wallet_id) row.unique_traders.add(t.wallet_id);
  }

  const rows = Array.from(byMarket.entries()).map(([market_id, v]) => ({
    market_id,
    platform_id: v.platform_id,
    date,
    total_volume: v.volume,
    num_trades: v.num_trades,
    avg_spread: null as number | null,
    median_spread: null as number | null,
    realized_vol: null as number | null,
    max_depth_bid_5: null as number | null,
    max_depth_ask_5: null as number | null,
    unique_traders: v.unique_traders.size,
    gini_participation: null as number | null,
  }));

  if (rows.length === 0) {
    console.log("No trades for date", date, "- nothing to upsert.");
    return;
  }

  const { error: upsertErr } = await supabase.from("market_daily_aggregates").upsert(rows, {
    onConflict: "market_id,date",
  });
  if (upsertErr) throw upsertErr;
  console.log("Upserted", rows.length, "market_daily_aggregates for", date);
}

function parseDate(s: string): string {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${s}`);
  return d.toISOString().slice(0, 10);
}

async function run(): Promise<void> {
  const backfillFrom = process.env.BACKFILL_FROM;
  const backfillTo = process.env.BACKFILL_TO;
  if (backfillFrom && backfillTo) {
    const from = parseDate(backfillFrom);
    const to = parseDate(backfillTo);
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();
    if (start > end) throw new Error("BACKFILL_FROM must be <= BACKFILL_TO");
    for (let t = start; t <= end; t += 86400 * 1000) {
      const date = new Date(t).toISOString().slice(0, 10);
      await runForDate(date);
    }
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  await runForDate(today);
  const yesterday = new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10);
  await runForDate(yesterday);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
