import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

/**
 * Chainable Supabase query builder mock that resolves to a given result.
 * Used so GET /api/markets can be tested without a real Supabase instance.
 */
function createSupabaseChain<T>(result: { data: T; error: null } | { data: null; error: { code?: string; message?: string } }) {
  const chain = {
    select: () => chain,
    range: () => chain,
    order: () => chain,
    eq: () => chain,
    in: () => chain,
    single: () => chain,
    then(resolve: (value: typeof result) => void) {
      return Promise.resolve(result).then(resolve);
    },
    catch(reject: (err: unknown) => void) {
      return Promise.resolve(result).catch(reject);
    },
  };
  return chain;
}

const mockMarketsEmpty = createSupabaseChain({ data: [], error: null });

const mockMarketsOne = createSupabaseChain({
  data: [
    {
      id: "m1",
      platform_id: "p1",
      external_market_id: "ext1",
      symbol: "SYM1",
      title: "Test Market",
      category: "sports",
      subcategory: null,
      status: "open",
      created_at: "2025-01-01T00:00:00Z",
      platforms: { name: "pred" },
    },
  ],
  error: null,
});

const mockAggregatesOne = createSupabaseChain({
  data: [
    {
      market_id: "m1",
      date: "2025-01-15",
      total_volume: 1000,
      num_trades: 50,
      unique_traders: 10,
      avg_spread: 25.5,
    },
  ],
  error: null,
});

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "markets") return mockMarketsEmpty;
      return mockMarketsEmpty;
    },
  },
}));

describe("GET /api/markets", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 200 with data array and nextOffset when Supabase returns empty list", async () => {
    const request = new NextRequest("http://localhost:3000/api/markets");
    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(0);
    expect(body).toHaveProperty("nextOffset");
    expect(body.nextOffset).toBeNull();
  });

  it("returns 200 with data and nextOffset shape when Supabase returns markets", async () => {
    vi.doMock("@/lib/supabase", () => ({
      supabase: {
        from: (table: string) => {
          if (table === "markets") return mockMarketsOne;
          if (table === "market_daily_aggregates") return mockAggregatesOne;
          return mockMarketsEmpty;
        },
      },
    }));
    const { GET: getMarkets } = await import("./route");
    const request = new NextRequest("http://localhost:3000/api/markets?limit=50");
    const response = await getMarkets(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty("id");
    expect(body.data[0]).toHaveProperty("stats");
    expect(body).toHaveProperty("nextOffset");
  });
});
