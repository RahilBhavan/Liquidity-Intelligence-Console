import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/export/market/[id]/daily
 * CSV download from market_daily_aggregates (and related) for the market.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase
      .from("market_daily_aggregates")
      .select("date, total_volume, num_trades, avg_spread, median_spread, realized_vol, max_depth_bid_5, max_depth_ask_5, unique_traders, gini_participation")
      .eq("market_id", id)
      .order("date", { ascending: true });

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const headers = ["date", "total_volume", "num_trades", "avg_spread", "median_spread", "realized_vol", "max_depth_bid_5", "max_depth_ask_5", "unique_traders", "gini_participation"];
    const rows = (data ?? []).map((r: Record<string, unknown>) =>
      headers.map((h) => (r[h] != null ? String(r[h]) : "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="market-${id}-daily.csv"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
