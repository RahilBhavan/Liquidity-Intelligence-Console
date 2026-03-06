import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

/**
 * Chainable Supabase query builder mock that resolves to "no rows" (PGRST116)
 * so GET /api/markets/[id] returns 404 when market is not found.
 */
function createSupabaseChainNotFound() {
  const chain = {
    select: () => chain,
    eq: () => chain,
    single: () => chain,
    then(resolve: (value: { data: null; error: { code: string; message?: string } }) => void) {
      return Promise.resolve({
        data: null,
        error: { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" },
      }).then(resolve);
    },
    catch(reject: (err: unknown) => void) {
      return Promise.resolve({
        data: null,
        error: { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" },
      }).catch(reject);
    },
  };
  return chain;
}

function createSupabaseChainFound(market: { id: string; title: string | null; symbol: string | null; platforms: { name: string } | null }) {
  const chain = {
    select: () => chain,
    eq: () => chain,
    single: () => chain,
    then(resolve: (value: { data: typeof market; error: null }) => void) {
      return Promise.resolve({ data: market, error: null }).then(resolve);
    },
    catch(reject: (err: unknown) => void) {
      return Promise.resolve({ data: market, error: null }).catch(reject);
    },
  };
  return chain;
}

let mockFromImpl: () => ReturnType<typeof createSupabaseChainNotFound>;
vi.mock("@/lib/supabase", () => ({
  supabase: {
    get from() {
      return mockFromImpl;
    },
  },
}));

// Default: not found
mockFromImpl = () => createSupabaseChainNotFound();

describe("GET /api/markets/[id]", () => {
  beforeEach(() => {
    mockFromImpl = () => createSupabaseChainNotFound();
  });

  it("returns 404 when market is not found (Supabase returns no row)", async () => {
    const request = new NextRequest("http://localhost:3000/api/markets/nonexistent-id");
    const context = { params: Promise.resolve({ id: "nonexistent-id" }) };
    const response = await GET(request, context);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty("error", "Market not found");
  });

  it("returns 200 with market body when market exists", async () => {
    const market = {
      id: "existing-market-id",
      title: "Will X happen?",
      symbol: "X",
      category: "sports",
      status: "open",
      platforms: { name: "pred" },
    };
    mockFromImpl = () => createSupabaseChainFound(market);

    const request = new NextRequest("http://localhost:3000/api/markets/existing-market-id");
    const context = { params: Promise.resolve({ id: "existing-market-id" }) };
    const response = await GET(request, context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("data");
    expect(body.data).toMatchObject({ id: "existing-market-id", title: "Will X happen?", symbol: "X" });
    expect(body.data).toHaveProperty("platformName", "pred");
  });
});
