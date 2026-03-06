import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** Revalidate list response every 60s on Vercel (ISR-style). */
export const revalidate = 60;

type AggRow = {
  total_volume: number;
  num_trades: number;
  unique_traders: number;
  avg_spread: number | null;
  health_score: number | null;
};

/**
 * GET /api/markets?platform=pred&category=sports&sort=health_score
 * List markets with basic stats and health_score (from markets + market_daily_aggregates).
 * sort=health_score orders by latest-day health score descending (nulls last).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const sortByHealth = sort === "health_score";
    const rangeStart = sortByHealth ? 0 : offset;
    const rangeEnd = sortByHealth ? 499 : offset + limit - 1;

    let query = supabase
      .from("markets")
      .select(
        "id, platform_id, external_market_id, symbol, title, category, subcategory, status, created_at, platforms(name)"
      )
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd);

    if (platform) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(platform);
      if (isUuid) {
        query = query.eq("platform_id", platform);
      } else {
        const { data: plat } = await supabase.from("platforms").select("id").eq("name", platform).single();
        if (plat?.id) query = query.eq("platform_id", plat.id);
      }
    }
    if (category) query = query.eq("category", category);

    const { data: markets, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!markets?.length) {
      return NextResponse.json({ data: [], nextOffset: null });
    }

    const marketIds = markets.map((m) => m.id);
    const { data: aggregates } = await supabase
      .from("market_daily_aggregates")
      .select("market_id, date, total_volume, num_trades, unique_traders, avg_spread, health_score")
      .in("market_id", marketIds)
      .order("date", { ascending: false });

    const aggByMarket = new Map<string, AggRow>();
    for (const a of aggregates ?? []) {
      if (!aggByMarket.has(a.market_id)) {
        aggByMarket.set(a.market_id, {
          total_volume: 0,
          num_trades: 0,
          unique_traders: 0,
          avg_spread: a.avg_spread != null ? Number(a.avg_spread) : null,
          health_score: a.health_score != null ? Number(a.health_score) : null,
        });
      }
      const row = aggByMarket.get(a.market_id)!;
      row.total_volume += Number(a.total_volume);
      row.num_trades += Number(a.num_trades);
      row.unique_traders = Math.max(row.unique_traders, Number(a.unique_traders));
    }

    let enriched = markets.map((m) => ({
      ...m,
      stats: aggByMarket.get(m.id) ?? {
        total_volume: 0,
        num_trades: 0,
        unique_traders: 0,
        avg_spread: null,
        health_score: null,
      },
      health_score: (aggByMarket.get(m.id) ?? { health_score: null }).health_score ?? null,
    }));

    if (sortByHealth) {
      enriched = enriched.sort((a, b) => {
        const va = a.health_score ?? -1;
        const vb = b.health_score ?? -1;
        return vb - va;
      });
    }

    const paginated = enriched.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      nextOffset: enriched.length > offset + limit ? offset + limit : null,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
