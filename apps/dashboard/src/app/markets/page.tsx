"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { SkeletonTable } from "@/components/skeleton-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

type Market = {
  id: string;
  title: string | null;
  symbol: string | null;
  category: string | null;
  status: string;
  platforms: { name: string } | null;
  health_score: number | null;
  stats: {
    total_volume: number;
    num_trades: number;
    unique_traders: number;
    avg_spread: number | null;
  };
};

type SortKey = "total_volume" | "num_trades" | "unique_traders" | "avg_spread" | "health_score" | "";
type SortDir = "asc" | "desc";

export default function MarketsPage() {
  const [data, setData] = useState<{
    data: Market[];
    nextOffset: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchMarkets = useCallback(
    (offset = 0, append = false) => {
      const params = new URLSearchParams();
      if (platform) params.set("platform", platform);
      if (category) params.set("category", category);
      params.set("limit", "50");
      params.set("offset", String(offset));
      if (sortKey === "health_score") params.set("sort", "health_score");
      const setLoader = append ? setLoadingMore : setLoading;
      setLoader(true);
      setError(null);
      fetch(`/api/markets?${params}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.error) {
            setError(res.error);
            return;
          }
          const next = res.data ?? [];
          const nextOffset = res.nextOffset ?? null;
          if (append) {
            setData((prev) =>
              prev
                ? { data: [...prev.data, ...next], nextOffset }
                : { data: next, nextOffset }
            );
          } else {
            setData({ data: next, nextOffset });
          }
        })
        .catch(() => setError("Failed to load markets"))
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [platform, category, sortKey]
  );

  useEffect(() => {
    fetchMarkets(0, false);
  }, [fetchMarkets]);

  const handleLoadMore = () => {
    if (data?.nextOffset == null || loadingMore) return;
    fetchMarkets(data.nextOffset, true);
  };

  const handleSort = (key: SortKey) => {
    if (key === "") return;
    setSortDir((d) => (sortKey === key && d === "desc" ? "asc" : "desc"));
    setSortKey(key);
  };

  const sorted =
    data?.data && sortKey
      ? [...data.data].sort((a, b) => {
          const va =
            sortKey === "health_score"
              ? a.health_score
              : a.stats[sortKey as keyof typeof a.stats];
          const vb =
            sortKey === "health_score"
              ? b.health_score
              : b.stats[sortKey as keyof typeof b.stats];
          if (va == null && vb == null) return 0;
          if (va == null) return sortDir === "asc" ? -1 : 1;
          if (vb == null) return sortDir === "asc" ? 1 : -1;
          const v = typeof va === "number" && typeof vb === "number" ? va - vb : 0;
          return sortDir === "asc" ? v : -v;
        })
      : data?.data ?? [];

  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Market explorer", href: undefined },
          ]}
        />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            Market explorer
          </h1>
          <p className="mt-1 text-sm text-primary/60">
            Filter by platform and category. Sort and open any market for liquidity and participants.
          </p>
        </header>

        <div className="mb-5 flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary/70">Platform</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded border border-primary/20 bg-surface px-3 py-2 text-sm text-primary focus-ring"
              aria-label="Filter by platform"
            >
              <option value="">All</option>
              <option value="pred">Pred</option>
              <option value="kash">Kash</option>
              <option value="kalshi">Kalshi</option>
              <option value="polymarket">Polymarket</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary/70">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded border border-primary/20 bg-surface px-3 py-2 text-sm text-primary focus-ring"
              aria-label="Filter by category"
            >
              <option value="">All</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
              <option value="macro">Macro</option>
              <option value="culture">Culture</option>
            </select>
          </label>
        </div>

        {error && (
          <ErrorState
            message={error}
            onRetry={() => fetchMarkets(0, false)}
            backHref="/"
            backLabel="Back to overview"
          />
        )}

        {!error && loading && (
          <SkeletonTable rows={8} cols={7} />
        )}

        {!error && !loading && data && (
          <>
            {sorted.length === 0 ? (
              <EmptyState
                title="No markets yet"
                description="Run ingestion and the pipeline to populate (see README). You can explore Benchmarks and Docs from the header."
                actionLabel="Back to overview"
                actionHref="/"
              />
            ) : (
              <>
                {/* Desktop: table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full rounded-lg border border-primary/10 text-sm">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="p-3 text-left font-medium text-primary" scope="col">
                          Market
                        </th>
                        <th className="p-3 text-left font-medium text-primary" scope="col">
                          Platform
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          <button
                            type="button"
                            onClick={() => handleSort("total_volume")}
                            className="focus-ring rounded px-1 py-0.5 -mr-1"
                            aria-sort={sortKey === "total_volume" ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                          >
                            Volume {sortKey === "total_volume" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </button>
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          <button
                            type="button"
                            onClick={() => handleSort("num_trades")}
                            className="focus-ring rounded px-1 py-0.5 -mr-1"
                            aria-sort={sortKey === "num_trades" ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                          >
                            Trades {sortKey === "num_trades" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </button>
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          <button
                            type="button"
                            onClick={() => handleSort("unique_traders")}
                            className="focus-ring rounded px-1 py-0.5 -mr-1"
                            aria-sort={sortKey === "unique_traders" ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                          >
                            Traders {sortKey === "unique_traders" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </button>
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          <button
                            type="button"
                            onClick={() => handleSort("avg_spread")}
                            className="focus-ring rounded px-1 py-0.5 -mr-1"
                            aria-sort={sortKey === "avg_spread" ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                          >
                            Avg spread {sortKey === "avg_spread" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </button>
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          <button
                            type="button"
                            onClick={() => handleSort("health_score")}
                            className="focus-ring rounded px-1 py-0.5 -mr-1"
                            aria-sort={sortKey === "health_score" ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                          >
                            Health {sortKey === "health_score" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </button>
                        </th>
                        <th className="p-3" aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((m) => (
                        <tr
                          key={m.id}
                          className="border-t border-primary/10 transition-colors hover:bg-primary/[0.02]"
                        >
                          <td className="p-3">
                            <span className="font-medium text-primary">
                              {m.title || m.symbol || m.id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="p-3 text-primary/70">
                            {(m.platforms as { name?: string })?.name ?? "—"}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {m.stats.total_volume.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {m.stats.num_trades}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {m.stats.unique_traders}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {m.stats.avg_spread != null
                              ? m.stats.avg_spread.toFixed(2)
                              : "—"}
                          </td>
                          <td className="p-3 text-right">
                            {m.health_score != null ? (
                              <span
                                className={
                                  m.health_score >= 80
                                    ? "font-medium text-emerald-600"
                                    : m.health_score >= 40
                                      ? "text-primary/80"
                                      : "text-primary/60"
                                }
                                title="Market health 0–100"
                              >
                                {Math.round(m.health_score)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-3">
                            <Link
                              href={`/markets/${m.id}`}
                              className="text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80 focus-ring rounded px-1 py-0.5"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: cards */}
                <div className="space-y-3 md:hidden">
                  {sorted.map((m) => (
                    <Link
                      key={m.id}
                      href={`/markets/${m.id}`}
                      className="block rounded-lg border border-primary/10 bg-surface p-4 transition-colors hover:border-primary/20 focus-ring"
                    >
                      <div className="font-medium text-primary">
                        {m.title || m.symbol || m.id.slice(0, 8)}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-primary/70">
                        <span>{(m.platforms as { name?: string })?.name ?? "—"}</span>
                        <span>Vol {m.stats.total_volume.toLocaleString()}</span>
                        <span>{m.stats.num_trades} trades</span>
                        <span>{m.stats.unique_traders} traders</span>
                        {m.stats.avg_spread != null && (
                          <span>Spread {m.stats.avg_spread.toFixed(2)}</span>
                        )}
                        {m.health_score != null && (
                          <span className="font-medium text-primary" title="Market health 0–100">
                            Health {Math.round(m.health_score)}
                          </span>
                        )}
                      </div>
                      <span className="mt-2 inline-block text-xs font-medium text-primary/60">
                        View detail →
                      </span>
                    </Link>
                  ))}
                </div>

                {data.nextOffset != null && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center border border-primary px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-surface focus-ring rounded disabled:opacity-50"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
