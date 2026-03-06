import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/benchmarks?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Platform-level headline metrics: total volume, active markets, avg spread.
 * Pred/Kash from market_daily_aggregates; Kalshi/Polymarket from incumbent_daily_metrics.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const today = new Date().toISOString().slice(0, 10);
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    const fromDate = from ?? defaultFrom.toISOString().slice(0, 10);
    const toDate = to ?? today;

    const { data: platforms } = await supabase.from("platforms").select("id, name");

    const platformById = new Map((platforms ?? []).map((p) => [p.id, p.name]));

    const { data: dailyRows } = await supabase
      .from("market_daily_aggregates")
      .select("platform_id, market_id, date, total_volume, avg_spread")
      .gte("date", fromDate)
      .lte("date", toDate);

    const aggByPlatform = new Map<
      string,
      { totalVolume: number; marketIds: Set<string>; spreadSum: number; spreadCount: number }
    >();
    for (const row of dailyRows ?? []) {
      const pid = row.platform_id;
      if (!aggByPlatform.has(pid)) {
        aggByPlatform.set(pid, {
          totalVolume: 0,
          marketIds: new Set(),
          spreadSum: 0,
          spreadCount: 0,
        });
      }
      const a = aggByPlatform.get(pid)!;
      a.totalVolume += Number(row.total_volume ?? 0);
      a.marketIds.add(row.market_id);
      if (row.avg_spread != null && !Number.isNaN(Number(row.avg_spread))) {
        a.spreadSum += Number(row.avg_spread);
        a.spreadCount += 1;
      }
    }

    const { data: incumbentRows } = await supabase
      .from("incumbent_daily_metrics")
      .select("platform_id, date, metric_name, value")
      .gte("date", fromDate)
      .lte("date", toDate)
      .in("metric_name", ["volume_24h", "active_markets_count"]);

    const incVolume = new Map<string, number>();
    const incActiveMarkets = new Map<string, number>();
    for (const row of incumbentRows ?? []) {
      const pid = row.platform_id;
      const val = row.value != null ? Number(row.value) : 0;
      if (row.metric_name === "volume_24h") {
        incVolume.set(pid, (incVolume.get(pid) ?? 0) + val);
      } else if (row.metric_name === "active_markets_count") {
        incActiveMarkets.set(pid, Math.max(incActiveMarkets.get(pid) ?? 0, val));
      }
    }

    const result: Array<{
      platformId: string;
      platformName: string;
      totalVolume: number;
      activeMarkets: number;
      avgSpreadBps: number | null;
    }> = [];

    for (const [platformId, name] of platformById) {
      const fromDaily = aggByPlatform.get(platformId);
      const volInc = incVolume.get(platformId);
      const activeInc = incActiveMarkets.get(platformId);

      if (fromDaily) {
        result.push({
          platformId,
          platformName: name ?? platformId,
          totalVolume: fromDaily.totalVolume,
          activeMarkets: fromDaily.marketIds.size,
          avgSpreadBps:
            fromDaily.spreadCount > 0
              ? Math.round((fromDaily.spreadSum / fromDaily.spreadCount) * 100) / 100
              : null,
        });
      } else if (volInc != null || activeInc != null) {
        result.push({
          platformId,
          platformName: name ?? platformId,
          totalVolume: volInc ?? 0,
          activeMarkets: activeInc ?? 0,
          avgSpreadBps: null,
        });
      }
    }

    result.sort((a, b) => a.platformName.localeCompare(b.platformName));

    return NextResponse.json({
      data: result,
      from: fromDate,
      to: toDate,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
