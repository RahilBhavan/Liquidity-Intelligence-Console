import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/markets/[id]
 * Returns a single market's metadata and latest health_score (from market_daily_aggregates).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing market id" }, { status: 400 });
    }

    const { data: market, error } = await supabase
      .from("markets")
      .select("id, title, symbol, category, status, platforms(name)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Market not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: latestAgg } = await supabase
      .from("market_daily_aggregates")
      .select("health_score, date")
      .eq("market_id", id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const health_score =
      latestAgg?.health_score != null ? Number(latestAgg.health_score) : null;

    return NextResponse.json({
      data: {
        ...market,
        platformName: (market.platforms as { name?: string } | null)?.name ?? null,
        health_score,
        health_score_date: latestAgg?.date ?? null,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
