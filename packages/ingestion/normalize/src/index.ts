/**
 * Normalization job: read pred_raw_events and kash_raw_events, upsert into
 * markets, market_outcomes, wallets, orders, trades, amm_trades.
 * Deterministic and re-runnable; use source_event_id / processed flag if needed.
 */
import { supabase } from "@lic/db";

const PRED_PLATFORM_ID = "a0000000-0000-4000-8000-000000000001";
const KASH_PLATFORM_ID = "a0000000-0000-4000-8000-000000000002";

type RawPredEvent = {
  id: number;
  block_number: number;
  tx_hash: string;
  log_index: number;
  event_name: string;
  raw_data: Record<string, unknown>;
  timestamp: string;
};

async function ensureWallet(platformId: string, address: string, isContract: boolean): Promise<string> {
  const { data: existing } = await supabase
    .from("wallets")
    .select("id")
    .eq("platform_id", platformId)
    .eq("address", address)
    .single();
  if (existing) return existing.id;
  const { data: inserted, error } = await supabase
    .from("wallets")
    .insert({
      platform_id: platformId,
      address,
      is_contract: isContract,
      first_seen_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  return inserted!.id;
}

async function ensureMarket(platformId: string, externalMarketId: string): Promise<string> {
  const { data: existing } = await supabase
    .from("markets")
    .select("id")
    .eq("platform_id", platformId)
    .eq("external_market_id", externalMarketId)
    .single();
  if (existing) return existing.id;
  const { data: inserted, error } = await supabase
    .from("markets")
    .insert({
      platform_id: platformId,
      external_market_id: externalMarketId,
      symbol: externalMarketId,
      status: "open",
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  return inserted!.id;
}

async function normalizePred(): Promise<void> {
  const { data: events, error: fetchErr } = await supabase
    .from("pred_raw_events")
    .select("id, event_name, raw_data, timestamp, tx_hash")
    .order("id", { ascending: true })
    .limit(5000) as { data: RawPredEvent[] | null; error: unknown };

  if (fetchErr || !events?.length) {
    console.log("No unprocessed Pred raw events (or error).");
    return;
  }

  for (const ev of events) {
    const args = ev.raw_data as Record<string, unknown>;
    const marketIdRaw = args.marketId ?? args.market_id;
    const makerRaw = args.maker;
    if (!marketIdRaw || !makerRaw) continue;

    const externalMarketId = typeof marketIdRaw === "string" ? marketIdRaw : (marketIdRaw as { toString: () => string }).toString?.() ?? String(marketIdRaw);
    const makerAddress = typeof makerRaw === "string" ? makerRaw : (makerRaw as { toString: () => string }).toString?.();

    const marketId = await ensureMarket(PRED_PLATFORM_ID, externalMarketId);
    const walletId = await ensureWallet(PRED_PLATFORM_ID, makerAddress, false);

    if (ev.event_name === "OrderPlaced") {
      const side = Number(args.side) === 0 ? "buy" : "sell";
      const price = Number(args.price ?? 0);
      const size = Number(args.size ?? 0);
      await supabase.from("orders").insert({
        market_id: marketId,
        wallet_id: walletId,
        side,
        price,
        size,
        remaining_size: size,
        status: "open",
        placed_at: ev.timestamp,
        source_event_id: ev.id,
      }).select().single().then(({ error }) => {
        if (error && error.code !== "23505") throw error;
      });
    }
  }
  console.log("Processed", events.length, "Pred raw events.");
}

async function normalizeKash(): Promise<void> {
  const { data: events, error: fetchErr } = await supabase
    .from("kash_raw_events")
    .select("id, event_name, raw_data, timestamp, tx_hash")
    .order("id", { ascending: true })
    .limit(5000) as { data: RawPredEvent[] | null; error: unknown };

  if (fetchErr || !events?.length) {
    console.log("No unprocessed Kash raw events (or error).");
    return;
  }

  for (const ev of events) {
    const args = ev.raw_data as Record<string, unknown>;
    const marketIdRaw = args.marketId ?? args.market_id;
    const traderRaw = args.trader ?? args.user;
    if (!marketIdRaw || !traderRaw) continue;

    const externalMarketId = typeof marketIdRaw === "string" ? marketIdRaw : (marketIdRaw as { toString: () => string }).toString?.() ?? String(marketIdRaw);
    const traderAddress = typeof traderRaw === "string" ? traderRaw : (traderRaw as { toString: () => string }).toString?.();

    const marketId = await ensureMarket(KASH_PLATFORM_ID, externalMarketId);
    const walletId = await ensureWallet(KASH_PLATFORM_ID, traderAddress, false);

    if (ev.event_name === "Swap") {
      const direction = Number(args.direction) === 0 ? "buy_shares" : "sell_shares";
      const price = Number(args.price ?? 0);
      const size = Number(args.size ?? 0);
      const notional = Number(args.notional ?? size * price);
      await supabase.from("amm_trades").insert({
        market_id: marketId,
        wallet_id: walletId,
        direction,
        price,
        size,
        notional,
        tx_hash: ev.tx_hash,
        timestamp: ev.timestamp,
      }).select().single().then(({ error }) => {
        if (error) throw error;
      });
    }
  }
  console.log("Processed", events.length, "Kash raw events.");
}

async function run(): Promise<void> {
  await normalizePred();
  await normalizeKash();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
