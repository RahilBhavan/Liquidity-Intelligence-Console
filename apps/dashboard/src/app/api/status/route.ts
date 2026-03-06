import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** Revalidate status every 30s so "Data as of" stays reasonably fresh. */
export const revalidate = 30;

/**
 * GET /api/status
 * Returns data freshness (latest snapshot/daily timestamp) and app health.
 * Used by the dashboard for "Data as of" and by monitors for health checks.
 */
export async function GET() {
  try {
    const [snapshotRes, dailyRes] = await Promise.all([
      supabase
        .from("market_liquidity_snapshots")
        .select("timestamp")
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("market_daily_aggregates")
        .select("date")
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const snapshotAt = snapshotRes.data?.timestamp ?? null;
    const dailyAt = dailyRes.data?.date ?? null;

    // Prefer snapshot timestamp (finer granularity); fall back to daily date
    const dataAsOf =
      snapshotAt != null
        ? typeof snapshotAt === "string"
          ? snapshotAt
          : new Date(snapshotAt).toISOString()
        : dailyAt != null
          ? typeof dailyAt === "string"
            ? `${dailyAt}T23:59:59Z`
            : new Date(dailyAt).toISOString()
          : null;

    return NextResponse.json({
      ok: true,
      status: "healthy",
      data: {
        dataAsOf,
        dataAsOfSnapshot: snapshotAt,
        dataAsOfDaily: dailyAt,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        status: "unhealthy",
        error: String(e),
        data: { dataAsOf: null, dataAsOfSnapshot: null, dataAsOfDaily: null },
      },
      { status: 500 }
    );
  }
}
