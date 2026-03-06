"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { SkeletonTable } from "@/components/skeleton-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

type BenchmarkRow = {
  platformId: string;
  platformName: string;
  totalVolume: number;
  activeMarkets: number;
  avgSpreadBps: number | null;
};

export default function BenchmarksPage() {
  const [data, setData] = useState<{
    rows: BenchmarkRow[];
    from: string;
    to: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const fetchBenchmarks = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ from, to });
    fetch(`/api/benchmarks?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          return;
        }
        setData({
          rows: res.data ?? [],
          from: res.from ?? from,
          to: res.to ?? to,
        });
      })
      .catch(() => setError("Failed to load benchmarks"))
      .finally(() => setLoading(false));
  }, [from, to]);

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Benchmarks", href: undefined },
          ]}
        />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            Benchmarks
          </h1>
          <p className="mt-1 text-sm text-primary/60">
            Compare Pred, Kash, Kalshi, and Polymarket by total volume, active markets, and average spread over a date range.
          </p>
        </header>

        <div className="mb-5 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-primary/70">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded border border-primary/20 bg-surface px-3 py-2 text-sm text-primary focus-ring"
              aria-label="Start date"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-primary/70">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded border border-primary/20 bg-surface px-3 py-2 text-sm text-primary focus-ring"
              aria-label="End date"
            />
          </label>
          <button
            type="button"
            onClick={() => fetchBenchmarks()}
            className="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-surface focus-ring"
          >
            Apply
          </button>
        </div>

        {error && (
          <ErrorState
            message={error}
            onRetry={fetchBenchmarks}
            backHref="/"
            backLabel="Back to overview"
          />
        )}

        {!error && loading && <SkeletonTable rows={5} cols={4} />}

        {!error && !loading && data && (
          <>
            {data.rows.length === 0 ? (
              <EmptyState
                title="No benchmark data"
                description="No data for this period. Run ingestion and pipeline to populate (see README)."
                actionLabel="Back to overview"
                actionHref="/"
              />
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-primary/10">
                  <table className="w-full text-sm">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="p-3 text-left font-medium text-primary" scope="col">
                          Platform
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          Total volume
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          Active markets
                        </th>
                        <th className="p-3 text-right font-medium text-primary" scope="col">
                          Avg spread (bps)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.map((row) => (
                        <tr
                          key={row.platformId}
                          className="border-t border-primary/10 hover:bg-primary/[0.02]"
                        >
                          <td className="p-3 font-medium text-primary capitalize">
                            {row.platformName}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {row.totalVolume.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {row.activeMarkets}
                          </td>
                          <td className="p-3 text-right text-primary/80">
                            {row.avgSpreadBps != null
                              ? row.avgSpreadBps.toFixed(2)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-primary/50">
                  Period: {data.from} to {data.to}. Pred/Kash from market_daily_aggregates; Kalshi/Polymarket from incumbent_daily_metrics.
                </p>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
