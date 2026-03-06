import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/markets/[id]/participants
 * Top wallets by volume and PnL for the market (from orders, trades, amm_trades, trader_daily_stats).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

    const { data: market } = await supabase.from("markets").select("id, platform_id").eq("id", id).single();
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const [ordersRes, tradesRes, ammTradesRes] = await Promise.all([
      supabase.from("orders").select("id, wallet_id, price, size, remaining_size, side").eq("market_id", id),
      supabase.from("trades").select("buy_order_id, sell_order_id, price, size").eq("market_id", id),
      supabase.from("amm_trades").select("wallet_id, notional").eq("market_id", id),
    ]);

    const orders = ordersRes.data ?? [];
    const trades = tradesRes.data ?? [];
    const ammTrades = ammTradesRes.data ?? [];

    const orderIdToWallet = new Map<string, string>();
    for (const o of orders) {
      if (o.wallet_id) orderIdToWallet.set(o.id, o.wallet_id);
    }

    const volumeByWallet = new Map<string, { volume: number; trades: number }>();

    for (const o of orders) {
      const vol = Number(o.price) * (Number(o.size) - Number(o.remaining_size ?? 0));
      const w = o.wallet_id;
      if (!w) continue;
      if (!volumeByWallet.has(w)) volumeByWallet.set(w, { volume: 0, trades: 0 });
      const row = volumeByWallet.get(w)!;
      row.volume += vol;
      row.trades += 1;
    }

    for (const t of trades) {
      const vol = Number(t.price) * Number(t.size);
      const buyWallet = orderIdToWallet.get(t.buy_order_id);
      const sellWallet = orderIdToWallet.get(t.sell_order_id);
      for (const w of [buyWallet, sellWallet].filter(Boolean) as string[]) {
        if (!volumeByWallet.has(w)) volumeByWallet.set(w, { volume: 0, trades: 0 });
        const row = volumeByWallet.get(w)!;
        row.volume += vol / 2;
        row.trades += 1;
      }
    }

    for (const t of ammTrades) {
      const w = t.wallet_id;
      if (!volumeByWallet.has(w)) volumeByWallet.set(w, { volume: 0, trades: 0 });
      const row = volumeByWallet.get(w)!;
      row.volume += Number(t.notional);
      row.trades += 1;
    }

    const sorted = [...volumeByWallet.entries()]
      .map(([wallet_id, v]) => ({ wallet_id, ...v }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);

    const walletIds = sorted.map((s) => s.wallet_id);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const [walletsRes, pnlRes] = await Promise.all([
      supabase.from("wallets").select("id, address").in("id", walletIds),
      walletIds.length > 0
        ? supabase
            .from("trader_daily_stats")
            .select("wallet_id, pnl_estimate")
            .eq("platform_id", market.platform_id)
            .in("wallet_id", walletIds)
            .gte("date", cutoffDate.toISOString().slice(0, 10))
        : { data: [] as { wallet_id: string; pnl_estimate: number | null }[] },
    ]);

    const walletMap = new Map((walletsRes.data ?? []).map((w) => [w.id, w.address]));
    const pnlByWallet = new Map<string, number>();
    for (const r of pnlRes.data ?? []) {
      if (r.pnl_estimate != null) {
        pnlByWallet.set(r.wallet_id, (pnlByWallet.get(r.wallet_id) ?? 0) + Number(r.pnl_estimate));
      }
    }

    const participants = sorted.map((s) => ({
      wallet_id: s.wallet_id,
      address: walletMap.get(s.wallet_id) ?? null,
      volume: s.volume,
      trades: s.trades,
      pnl_estimate: pnlByWallet.has(s.wallet_id) ? pnlByWallet.get(s.wallet_id) ?? null : null,
    }));

    return NextResponse.json({ data: participants });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
