"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Breadcrumb } from "@/components/breadcrumb";
import { SkeletonChart } from "@/components/skeleton-chart";
import { SkeletonTable } from "@/components/skeleton-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

type MarketMeta = {
  id: string;
  title: string | null;
  symbol: string | null;
  platformName: string | null;
  health_score: number | null;
  health_score_date: string | null;
};

type LiquidityPoint = {
  timestamp: string;
  spread_bps: number | null;
  volume_1h: number;
  trades_1h: number;
  unique_traders_1h: number;
};

type Participant = {
  wallet_id: string;
  address: string | null;
  volume: number;
  trades: number;
  pnl_estimate: number | null;
};

export default function MarketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [market, setMarket] = useState<MarketMeta | null>(null);
  const [liquidity, setLiquidity] = useState<LiquidityPoint[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/markets/${id}`).then((r) => r.json()),
      fetch(`/api/markets/${id}/liquidity?limit=200`).then((r) => r.json()),
      fetch(`/api/markets/${id}/participants?limit=20`).then((r) => r.json()),
    ])
      .then(([metaRes, liqRes, partRes]) => {
        if (metaRes.error && metaRes.error !== "Market not found") {
          setError(metaRes.error);
          return;
        }
        if (metaRes.data) setMarket(metaRes.data);
        setLiquidity(liqRes.data ?? []);
        setParticipants(partRes.data ?? []);
      })
      .catch(() => setError("Failed to load market data"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = liquidity.map((d) => ({
    ...d,
    time: d.timestamp.slice(0, 16),
    spread: d.spread_bps != null ? Number(d.spread_bps) : null,
  }));

  const title =
    market?.title || market?.symbol || (id.length > 8 ? `${id.slice(0, 8)}…` : id);

  const handleDownloadPng = useCallback(async () => {
    const el = chartContainerRef.current;
    if (!el) return;
    setExporting(true);
    setExportError(null);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `market-${id}-liquidity-${dateStr}.png`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Markets", href: "/markets" },
            { label: title, href: undefined },
          ]}
        />

        {error && (
          <ErrorState
            message={error}
            onRetry={load}
            backHref="/markets"
            backLabel="Back to markets"
          />
        )}

        {!error && (
          <>
            <header className="mb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
                    {loading ? "…" : title}
                  </h1>
                  {market?.platformName && (
                    <p className="mt-1 text-sm text-primary/60">
                      {market.platformName}
                    </p>
                  )}
                </div>
                {!loading && market?.health_score != null && (
                  <div className="flex flex-col items-end">
                    <span
                      className={
                        market.health_score >= 80
                          ? "text-2xl font-semibold text-emerald-600"
                          : market.health_score >= 40
                            ? "text-2xl font-semibold text-primary"
                            : "text-2xl font-semibold text-primary/70"
                      }
                      title="Market health 0–100 (see Methodology)"
                    >
                      {Math.round(market.health_score)}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-primary/50">
                      Market health
                    </span>
                    {market.health_score_date && (
                      <span className="mt-0.5 text-xs text-primary/50">
                        as of {market.health_score_date}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </header>

            {loading && (
              <>
                <section className="mb-6" aria-hidden>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary/50">
                    Liquidity
                  </h2>
                  <SkeletonChart />
                </section>
                <section className="mb-6" aria-hidden>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary/50">
                    Participants
                  </h2>
                  <SkeletonTable rows={5} cols={4} />
                </section>
              </>
            )}

            {!loading && (
              <>
                <section className="mb-6">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50">
                      Liquidity (spread & volume 1h)
                    </h2>
                    {chartData.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDownloadPng}
                          disabled={exporting}
                          className="rounded border border-primary/20 bg-surface px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 focus-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {exporting ? "Exporting…" : "Download PNG"}
                        </button>
                        {exportError && (
                          <span className="text-xs text-red-600" role="alert">
                            {exportError}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {chartData.length > 0 ? (
                    <div
                      ref={chartContainerRef}
                      className="h-64 w-full rounded-lg border border-primary/10 bg-white p-4"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(17,17,17,0.08)"
                          />
                          <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: "rgba(17,17,17,0.6)" }}
                          />
                          <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 10, fill: "rgba(17,17,17,0.6)" }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 10, fill: "rgba(17,17,17,0.6)" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fafafa",
                              border: "1px solid rgba(17,17,17,0.1)",
                              borderRadius: "6px",
                            }}
                            labelStyle={{ color: "#111" }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="spread"
                            stroke="#111"
                            name="Spread (bps)"
                            dot={false}
                            strokeWidth={2}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="volume_1h"
                            stroke="rgba(17,17,17,0.5)"
                            name="Volume 1h"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <EmptyState
                      title="No liquidity snapshots"
                      description="Run the liquidity-snapshots analytics job to populate data."
                      actionLabel="Back to markets"
                      actionHref="/markets"
                    />
                  )}
                </section>

                <section className="mb-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary/50">
                    Top participants (by volume)
                  </h2>
                  {participants.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-primary/10">
                      <table className="w-full text-sm">
                        <thead className="bg-primary/5">
                          <tr>
                            <th className="p-3 text-left font-medium text-primary" scope="col">
                              Address
                            </th>
                            <th className="p-3 text-right font-medium text-primary" scope="col">
                              Volume
                            </th>
                            <th className="p-3 text-right font-medium text-primary" scope="col">
                              Trades
                            </th>
                            <th className="p-3 text-right font-medium text-primary" scope="col">
                              PnL (est.)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p) => (
                            <tr
                              key={p.wallet_id}
                              className="border-t border-primary/10 transition-colors hover:bg-primary/[0.02]"
                            >
                              <td className="p-3 font-mono text-primary/80">
                                {p.address ?? p.wallet_id.slice(0, 8)}
                              </td>
                              <td className="p-3 text-right text-primary/80">
                                {p.volume.toLocaleString()}
                              </td>
                              <td className="p-3 text-right text-primary/80">
                                {p.trades}
                              </td>
                              <td className="p-3 text-right text-primary/80">
                                {p.pnl_estimate != null
                                  ? p.pnl_estimate.toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      title="No participant data"
                      description="Participant stats will appear after ingestion and aggregation."
                    />
                  )}
                </section>

                <section className="mb-6">
                  <Link
                    href={`/api/export/market/${id}/daily`}
                    className="inline-flex items-center border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-surface focus-ring rounded transition-colors"
                  >
                    Download daily CSV
                  </Link>
                  <p className="mt-2 text-sm text-primary/60">
                    Export market_daily_aggregates for this market.
                  </p>
                </section>

                <section>
                  <Link
                    href={`/social/${id}`}
                    className="text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80 focus-ring rounded px-1 py-0.5"
                  >
                    View social (Kash) →
                  </Link>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
