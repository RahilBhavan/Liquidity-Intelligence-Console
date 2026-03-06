import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/markets/[id]/liquidity?interval=15m
 * Time-series of market_liquidity_snapshots for the market.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const interval = searchParams.get("interval") ?? "15m";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = Math.min(Number(searchParams.get("limit")) || 500, 1000);

    let query = supabase
      .from("market_liquidity_snapshots")
      .select("timestamp, best_bid_price, best_ask_price, spread, spread_bps, depth_bid_1, depth_ask_1, depth_bid_5, depth_ask_5, volume_1h, trades_1h, unique_traders_1h")
      .eq("market_id", id)
      .order("timestamp", { ascending: true })
      .limit(limit);

    if (from) query = query.gte("timestamp", from);
    if (to) query = query.lte("timestamp", to);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, interval });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
