/**
 * Incumbent collector: fetches aggregate metrics from Kalshi and Polymarket APIs
 * and writes to incumbent_daily_metrics. Run daily (cron) or on-demand.
 *
 * Ingested platforms: Kalshi, Polymarket (see platforms seed in migration
 * 20250101000005_incumbent_and_positions.sql).
 */
import { supabase } from "@lic/db";

const KALSHI_API_BASE =
  process.env.KALSHI_API_BASE ?? "https://api.elections.kalshi.com/trade-api/v2";
const POLYMARKET_API_BASE =
  process.env.POLYMARKET_API_BASE ?? "https://gamma-api.polymarket.com";

const KALSHI_PLATFORM_ID = "a0000000-0000-4000-8000-000000000003";
const POLYMARKET_PLATFORM_ID = "a0000000-0000-4000-8000-000000000004";

type MetricRow = {
  platform_id: string;
  date: string;
  metric_name: string;
  value: number | null;
  raw_response: Record<string, unknown> | null;
};

/** Kalshi API: GET /markets returns { markets: Market[], cursor?: string }. Market has volume, volume_24h. */
type KalshiMarketsResponse = {
  markets?: Array<{
    ticker?: string;
    volume?: number;
    volume_24h?: number;
    volume_fp?: string;
    volume_24h_fp?: string;
    status?: string;
  }>;
  cursor?: string;
};

async function fetchKalshiMetrics(date: string): Promise<MetricRow[]> {
  const rows: MetricRow[] = [];
  try {
    let cursor: string | undefined;
    let totalOpenMarkets = 0;
    let totalVolume24h = 0;
    const sample: unknown[] = [];

    do {
      const url = new URL(`${KALSHI_API_BASE}/markets`);
      url.searchParams.set("status", "open");
      url.searchParams.set("limit", "200");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString());
      if (!res.ok) {
        console.warn("Kalshi markets response not ok:", res.status, await res.text());
        break;
      }

      const data = (await res.json()) as KalshiMarketsResponse;
      const markets = data.markets ?? [];
      if (sample.length === 0 && markets.length > 0) sample.push(markets[0]);

      for (const m of markets) {
        totalOpenMarkets += 1;
        const v24 = m.volume_24h ?? Number(m.volume_24h_fp) ?? 0;
        totalVolume24h += typeof v24 === "number" && !Number.isNaN(v24) ? v24 : 0;
      }
      cursor = data.cursor;
    } while (cursor);

    rows.push({
      platform_id: KALSHI_PLATFORM_ID,
      date,
      metric_name: "active_markets_count",
      value: totalOpenMarkets,
      raw_response: { sample: sample[0] ?? null },
    });
    rows.push({
      platform_id: KALSHI_PLATFORM_ID,
      date,
      metric_name: "volume_24h",
      value: totalVolume24h || null,
      raw_response: null,
    });
  } catch (e) {
    console.warn("Kalshi fetch failed:", e);
  }
  return rows;
}

/** Polymarket Gamma API: GET /events returns Event[]. Events have volume, volume_24hr. */
type PolymarketEvent = {
  id?: string;
  slug?: string;
  title?: string;
  volume?: number;
  volume_24hr?: number;
  active?: boolean;
  closed?: boolean;
  markets?: unknown[];
};

async function fetchPolymarketMetrics(date: string): Promise<MetricRow[]> {
  const rows: MetricRow[] = [];
  try {
    let offset = 0;
    const limit = 100;
    let totalActive = 0;
    let totalVolume24h = 0;
    const sample: unknown[] = [];

    while (true) {
      const url = new URL(`${POLYMARKET_API_BASE}/events`);
      url.searchParams.set("active", "true");
      url.searchParams.set("closed", "false");
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(offset));
      url.searchParams.set("order", "volume_24hr");
      url.searchParams.set("ascending", "false");

      const res = await fetch(url.toString());
      if (!res.ok) {
        console.warn("Polymarket events response not ok:", res.status, await res.text());
        break;
      }

      const data = (await res.json()) as PolymarketEvent[];
      if (!Array.isArray(data) || data.length === 0) break;
      if (sample.length === 0) sample.push(data[0]);

      for (const e of data) {
        totalActive += 1;
        const v = (e as { volume_24hr?: number }).volume_24hr ?? (e as { volume?: number }).volume ?? 0;
        totalVolume24h += typeof v === "number" && !Number.isNaN(v) ? v : 0;
      }
      offset += data.length;
      if (data.length < limit) break;
    }

    rows.push({
      platform_id: POLYMARKET_PLATFORM_ID,
      date,
      metric_name: "active_markets_count",
      value: totalActive,
      raw_response: { sample: sample[0] ?? null },
    });
    rows.push({
      platform_id: POLYMARKET_PLATFORM_ID,
      date,
      metric_name: "volume_24h",
      value: totalVolume24h || null,
      raw_response: null,
    });
  } catch (e) {
    console.warn("Polymarket fetch failed:", e);
  }
  return rows;
}

async function run(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const kalshi = await fetchKalshiMetrics(today);
  const poly = await fetchPolymarketMetrics(today);
  const all = [...kalshi, ...poly];
  if (all.length === 0) {
    console.log(
      "No incumbent metrics collected (APIs may need different base URLs or keys). Check KALSHI_API_BASE and POLYMARKET_API_BASE."
    );
    return;
  }
  const { error } = await supabase.from("incumbent_daily_metrics").upsert(all, {
    onConflict: "platform_id,date,metric_name",
  });
  if (error) throw error;
  console.log("Upserted", all.length, "incumbent daily metric rows (Kalshi + Polymarket).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
