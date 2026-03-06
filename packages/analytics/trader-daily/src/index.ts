/**
 * trader_daily_stats: per (wallet_id, platform_id, date) from trades and amm_trades.
 * maker_volume / taker_volume from Pred orders; amm_volume from Kash.
 */
import { supabase } from "@lic/db";

async function runForDate(date: string): Promise<void> {
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59.999Z`;

  const byWallet = new Map<
    string,
    { platform_id: string; num_trades: number; maker_volume: number; taker_volume: number; amm_volume: number }
  >();

  const { data: trades } = await supabase
    .from("trades")
    .select("market_id, buy_order_id, sell_order_id, price, size, taker_side")
    .gte("timestamp", start)
    .lte("timestamp", end);

  for (const t of trades ?? []) {
    const { data: m } = await supabase.from("markets").select("platform_id").eq("id", t.market_id).single();
    const platformId = m?.platform_id ?? "";
    const vol = Number(t.price) * Number(t.size);
    const buyOrderId = t.buy_order_id;
    const sellOrderId = t.sell_order_id;
    const { data: buyOrder } = await supabase.from("orders").select("wallet_id").eq("id", buyOrderId).single();
    const { data: sellOrder } = await supabase.from("orders").select("wallet_id").eq("id", sellOrderId).single();
    const takerWalletId = t.taker_side === "buy" ? buyOrder?.wallet_id : sellOrder?.wallet_id;
    const makerWalletId = t.taker_side === "buy" ? sellOrder?.wallet_id : buyOrder?.wallet_id;
    if (takerWalletId) {
      const key = takerWalletId;
      if (!byWallet.has(key)) byWallet.set(key, { platform_id: platformId, num_trades: 0, maker_volume: 0, taker_volume: 0, amm_volume: 0 });
      const row = byWallet.get(key)!;
      row.num_trades += 1;
      row.taker_volume += vol;
    }
    if (makerWalletId) {
      const key = makerWalletId;
      if (!byWallet.has(key)) byWallet.set(key, { platform_id: platformId, num_trades: 0, maker_volume: 0, taker_volume: 0, amm_volume: 0 });
      const row = byWallet.get(key)!;
      row.maker_volume += vol;
    }
  }

  const { data: ammTrades } = await supabase
    .from("amm_trades")
    .select("market_id, wallet_id, notional")
    .gte("timestamp", start)
    .lte("timestamp", end);

  for (const t of ammTrades ?? []) {
    const { data: m } = await supabase.from("markets").select("platform_id").eq("id", t.market_id).single();
    const platformId = m?.platform_id ?? "";
    const key = t.wallet_id;
    if (!byWallet.has(key)) byWallet.set(key, { platform_id: platformId, num_trades: 0, maker_volume: 0, taker_volume: 0, amm_volume: 0 });
    const row = byWallet.get(key)!;
    row.num_trades += 1;
    row.amm_volume += Number(t.notional);
  }

  const rows = Array.from(byWallet.entries()).map(([wallet_id, v]) => ({
    wallet_id,
    platform_id: v.platform_id,
    date,
    num_trades: v.num_trades,
    maker_volume: v.maker_volume,
    taker_volume: v.taker_volume,
    amm_volume: v.amm_volume,
    pnl_estimate: null as number | null,
  }));

  if (rows.length === 0) {
    console.log("No trader activity for date", date);
    return;
  }

  const { error } = await supabase.from("trader_daily_stats").upsert(rows, {
    onConflict: "wallet_id,platform_id,date",
  });
  if (error) throw error;
  console.log("Upserted", rows.length, "trader_daily_stats for", date);
}

async function run(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await runForDate(today);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
