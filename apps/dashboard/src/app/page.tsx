import Link from "next/link";

/**
 * Demo/overview page: immersion-style editorial minimalism.
 * Hero: full-viewport typography, scroll indicator. Value grid, marquee, sections, footer CTA.
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <main id="main">
        {/* Hero — same content width as sections, content-driven height */}
        <header className="max-w-6xl mx-auto px-6 md:px-12 pt-10 pb-8 md:pt-12 md:pb-10">
          <div className="max-w-5xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60 mb-3">
              Independent liquidity intelligence
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl">
              Liquidity intelligence for prediction markets
            </h1>
            <p className="mt-5 text-lg md:text-xl text-primary/70 max-w-2xl leading-relaxed">
              Institutional-grade spreads, depth, and behavior metrics. An objective
              view of market health—and how social virality maps into real liquidity.
            </p>
            <p className="mt-3 text-base text-primary/60 max-w-2xl">
              Use it to show investors liquidity, spot whale-dominated markets, and compare to Kalshi and Polymarket.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/markets"
                className="inline-flex items-center border border-primary px-6 py-3 text-sm font-medium hover:bg-primary hover:text-surface focus-ring rounded transition-colors"
              >
                Explore markets
              </Link>
              <Link
                href="/markets?platform=pred"
                className="inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded px-2 py-1 transition-colors"
              >
                Pred →
              </Link>
              <Link
                href="/markets?platform=kash"
                className="inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded px-2 py-1 transition-colors"
              >
                Kash →
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1.5 mt-8">
            <span className="text-xs uppercase tracking-[0.2em] text-primary/50">
              Scroll
            </span>
            <div
              className="w-px h-8 bg-primary/30 animate-scroll-bounce"
              aria-hidden
            />
          </div>
        </header>

      {/* Marquee — same vertical rhythm as section padding */}
      <section className="border-y border-primary/10 bg-primary/[0.02] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          <span className="text-sm md:text-base text-primary/60 px-8">
            A liquidity intelligence console for Pred, Kash, and incumbent benchmarks.
          </span>
          <span className="text-sm md:text-base text-primary/60 px-8">
            A liquidity intelligence console for Pred, Kash, and incumbent benchmarks.
          </span>
        </div>
      </section>

      {/* Value proposition — 3-column grid, same padding as all sections */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          What it does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-3">
              End-to-end
            </h3>
            <p className="text-primary/80 leading-relaxed">
              From raw chain and API events to normalized entities to aggregated
              snapshots and daily stats. Every step is designed for idempotent
              ingestion and fast dashboards.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-3">
              Flexible by design
            </h3>
            <p className="text-primary/80 leading-relaxed">
              Filter by platform, category, and date. Query spreads, depth, volume,
              and participant concentration. Export CSV per market for decks and
              external tools.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-3">
              Always in control
            </h3>
            <p className="text-primary/80 leading-relaxed">
              Founders, quants, and builders get an objective third-party view—no
              lock-in. Compare Pred and Kash to Kalshi and Polymarket on
              headline metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Use this to — founder use cases (Phase 2) */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Use this to
        </h2>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold text-primary">Show investors your liquidity vs incumbents</span>
            <span className="text-primary/70"> — Benchmarks and exportable charts.</span>
          </li>
          <li>
            <span className="font-semibold text-primary">Spot unhealthy or whale-dominated markets</span>
            <span className="text-primary/70"> — Health score, Gini, top wallets.</span>
          </li>
          <li>
            <span className="font-semibold text-primary">Compare your spreads and depth to Kalshi and Polymarket</span>
            <span className="text-primary/70"> — Benchmark view and methodology.</span>
          </li>
        </ul>
      </section>

      {/* Pipeline overview — editorial block, same section padding */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Overview
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-primary/80 max-w-3xl">
          The console ingests event-level data from{" "}
          <strong className="text-primary font-medium">Pred</strong> (Base-native
          order-book sports exchange) and{" "}
          <strong className="text-primary font-medium">Kash</strong> (social-native
          prediction market on X with a bonding-curve AMM). It normalizes that
          data, computes liquidity and behavior metrics, and exposes them via a
          web dashboard and exportable reports.
        </p>
      </section>

      {/* Data pipeline — clean strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Data pipeline
        </h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">Ingestion</h3>
            <p className="text-primary/70 text-sm leading-relaxed">
              Pred indexer, Kash chain/API + social, incumbent collectors → append-only
              raw tables (<code className="bg-primary/5 px-1">pred_raw_events</code>,{" "}
              <code className="bg-primary/5 px-1">kash_raw_events</code>).
            </p>
          </div>
          <span className="hidden md:inline text-primary/30 text-2xl">→</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">Normalized</h3>
            <p className="text-primary/70 text-sm leading-relaxed">
              Markets, orders, trades, wallets, social_posts, social_metrics.
            </p>
          </div>
          <span className="hidden md:inline text-primary/30 text-2xl">→</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">Aggregated</h3>
            <p className="text-primary/70 text-sm leading-relaxed">
              market_liquidity_snapshots, market_daily_aggregates, trader_daily_stats.
            </p>
          </div>
        </div>
      </section>

      {/* Data sources — list / grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Data sources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "Pred",
              desc: "Base-native order-book sports prediction exchange.",
              slug: "pred",
              href: "/markets?platform=pred",
              label: "View markets →",
            },
            {
              name: "Kash",
              desc: "Social-native AMM on X via @kash_bot.",
              slug: "kash",
              href: "/markets?platform=kash",
              label: "View markets →",
            },
            {
              name: "Kalshi",
              desc: "Incumbent benchmark.",
              slug: "kalshi",
              href: "/markets?platform=kalshi",
              label: "View markets →",
            },
            {
              name: "Polymarket",
              desc: "Incumbent benchmark.",
              slug: "polymarket",
              href: "/markets?platform=polymarket",
              label: "View markets →",
            },
          ].map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              className="group block py-4 border-b border-primary/10 hover:border-primary/30 focus-ring rounded transition-colors"
            >
              <h3 className="font-semibold text-primary group-hover:underline">
                {p.name}
              </h3>
              <p className="text-sm text-primary/60 mt-1">{p.desc}</p>
              <span className="text-xs text-primary/50 mt-2 inline-block">
                {p.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/benchmarks"
            className="inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded px-2 py-1"
          >
            Compare all platforms (Benchmarks) →
          </Link>
        </div>
      </section>

      {/* Key metrics — numbered list (services-style) */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Key metrics
        </h2>
        <ul className="space-y-5">
          {[
            {
              n: "1",
              title: "Spreads",
              detail:
                "Top-of-book (best ask − best bid) in bps. From order book (Pred) or implied from curve (Kash).",
            },
            {
              n: "2",
              title: "Depth",
              detail:
                "Size at top 1 and top 5 levels (bid/ask). For Kash, approximated from the curve.",
            },
            {
              n: "3",
              title: "Volume & participation",
              detail:
                "Notional, trade count, unique traders. Gini participation for concentration.",
            },
            {
              n: "4",
              title: "Whale vs retail",
              detail:
                "Trader daily stats to spot whale-dominated markets and wash-trading patterns.",
            },
            {
              n: "5",
              title: "Social (Kash)",
              detail:
                "Engagement and sentiment; linked to markets via social_market_links.",
            },
            {
              n: "6",
              title: "Benchmarks",
              detail:
                "Compare Pred/Kash to Kalshi and Polymarket.",
            },
          ].map((m) => (
            <li key={m.n} className="flex gap-4 md:gap-8">
              <span className="text-2xl font-semibold text-primary/30 tabular-nums">
                {m.n}
              </span>
              <div>
                <h3 className="font-semibold text-primary">{m.title}</h3>
                <p className="text-sm text-primary/70 mt-1">{m.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-12 border-t border-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/50 mb-6">
          Who it’s for
        </h2>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold text-primary">Founders / Execs</span>
            <span className="text-primary/70"> — High-level KPIs and comparisons vs incumbents.</span>
          </li>
          <li>
            <span className="font-semibold text-primary">Quant / Product</span>
            <span className="text-primary/70"> — Flexible queries on spreads, depth, cohorts.</span>
          </li>
          <li>
            <span className="font-semibold text-primary">Builders</span>
            <span className="text-primary/70"> — Coherent system explainable in 15–30 min.</span>
          </li>
        </ul>
      </section>

      {/* Footer CTA — compact */}
      <footer className="flex flex-col justify-center px-6 md:px-12 py-14 md:py-16 border-t border-primary/10 bg-primary/[0.02]">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
            Ready to explore?
          </h2>
          <p className="mt-4 text-base md:text-lg text-primary/70">
            Open the market explorer, filter by platform, and inspect liquidity
            and participants. Export CSV per market via the API.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/markets"
              className="inline-flex items-center border-2 border-primary px-8 py-4 text-sm font-semibold hover:bg-primary hover:text-surface focus-ring rounded transition-colors"
            >
              Open market explorer
            </Link>
            <Link
              href="/markets?platform=pred"
              className="inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded px-2 py-1"
            >
              Pred markets
            </Link>
            <Link
              href="/markets?platform=kash"
              className="inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded px-2 py-1"
            >
              Kash markets
            </Link>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-primary/10 text-sm text-primary/60">
          <p className="mb-2">
            <strong className="text-primary/80">Not affiliated</strong> with Pred, Kash, or any incumbent. Independent third-party analytics.
          </p>
          <p>
            Data: market_daily_aggregates, market_liquidity_snapshots, trader_daily_stats.
            Export: <code className="bg-primary/5 px-1 rounded">/api/export/market/[id]/daily</code>.
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
}
