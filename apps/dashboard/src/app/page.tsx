import Link from "next/link";

/**
 * Demo/overview page: Premium, modern analytics product style.
 * Maximized width (max-w-7xl), strong visual hierarchy, subtle borders.
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface text-primary selection:bg-primary/10">
      <main id="main">
        {/* Hero Section */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-16 md:pt-32 md:pb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary/80 mb-8 backdrop-blur-sm transition-colors hover:bg-primary/10">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Independent Liquidity Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-medium tracking-tight text-balance leading-[1.05]">
            Liquidity intelligence <br className="hidden md:block" /> for prediction markets
          </h1>
          <p className="mt-8 text-lg md:text-xl text-primary/60 max-w-3xl leading-relaxed text-balance">
            Institutional-grade spreads, depth, and behavior metrics. An objective
            view of market health—and how social virality maps into real liquidity.
          </p>
          <p className="mt-4 text-base md:text-lg text-primary/50 max-w-2xl text-balance">
            Use it to show investors liquidity, spot whale-dominated markets, and compare to Kalshi and Polymarket.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/markets"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-surface transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Explore markets
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/markets?platform=pred"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-primary/10 bg-transparent px-6 text-sm font-medium text-primary transition-all hover:bg-primary/5 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Pred &rarr;
              </Link>
              <Link
                href="/markets?platform=kash"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-primary/10 bg-transparent px-6 text-sm font-medium text-primary transition-all hover:bg-primary/5 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Kash &rarr;
              </Link>
            </div>
          </div>
        </header>

        {/* Pipeline Overview */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="rounded-[2rem] border border-primary/10 bg-primary/[0.02] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">
                End-to-end data pipeline
              </h2>
              <p className="text-primary/70 text-lg leading-relaxed">
                The console ingests event-level data from <strong className="text-primary font-medium">Pred</strong> (Base-native
                order-book sports exchange) and <strong className="text-primary font-medium">Kash</strong> (social-native
                prediction market on X with a bonding-curve AMM). It normalizes that
                data, computes liquidity and behavior metrics, and exposes them via a
                web dashboard and exportable reports.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-primary/10 -translate-y-1/2 z-0"></div>
              
              <div className="relative z-10 rounded-2xl border border-primary/10 bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <h3 className="text-base font-semibold text-primary mb-2">1. Ingestion</h3>
                <p className="text-primary/60 text-sm leading-relaxed mb-4">
                  Pred indexer, Kash chain/API + social, incumbent collectors write to append-only raw tables.
                </p>
                <div className="flex flex-wrap gap-2">
                  <code className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] font-mono text-primary/70">pred_raw_events</code>
                  <code className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] font-mono text-primary/70">kash_raw_events</code>
                </div>
              </div>

              <div className="relative z-10 rounded-2xl border border-primary/10 bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-base font-semibold text-primary mb-2">2. Normalized</h3>
                <p className="text-primary/60 text-sm leading-relaxed mb-4">
                  Raw events are parsed into clean entities and relationships.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] text-primary/70">Markets</span>
                  <span className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] text-primary/70">Orders & Trades</span>
                  <span className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] text-primary/70">Social</span>
                </div>
              </div>

              <div className="relative z-10 rounded-2xl border border-primary/10 bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <svg className="w-5 h-5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-base font-semibold text-primary mb-2">3. Aggregated</h3>
                <p className="text-primary/60 text-sm leading-relaxed mb-4">
                  Pre-computed analytics optimized for fast dashboards and exports.
                </p>
                <div className="flex flex-wrap gap-2">
                  <code className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] font-mono text-primary/70">market_liquidity_snapshots</code>
                  <code className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-[11px] font-mono text-primary/70">market_daily_aggregates</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 border-t border-primary/5">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-balance">
              Everything you need for market health analysis
            </h2>
            <p className="text-lg text-primary/60 max-w-2xl text-balance">
              From raw events to daily stats, designed for scale, flexibility, and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-transparent p-8 md:p-10 flex flex-col justify-end min-h-[320px] transition-colors hover:bg-primary/[0.04]">
              <h3 className="text-xl font-medium text-primary mb-3">End-to-end</h3>
              <p className="text-primary/60 text-base leading-relaxed max-w-lg">
                From raw chain and API events to normalized entities to aggregated
                snapshots and daily stats. Every step is designed for idempotent
                ingestion and fast dashboards.
              </p>
            </div>
            
            <div className="col-span-1 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-transparent p-8 md:p-10 flex flex-col justify-end min-h-[320px] transition-colors hover:bg-primary/[0.04]">
              <h3 className="text-xl font-medium text-primary mb-3">Flexible by design</h3>
              <p className="text-primary/60 text-base leading-relaxed">
                Filter by platform, category, and date. Query spreads, depth, volume,
                and participant concentration. Export CSV per market for decks and external tools.
              </p>
            </div>

            <div className="col-span-1 lg:col-span-3 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-transparent p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between min-h-[240px] gap-8 transition-colors hover:bg-primary/[0.04]">
              <div className="max-w-2xl">
                <h3 className="text-xl font-medium text-primary mb-3">Always in control</h3>
                <p className="text-primary/60 text-base leading-relaxed">
                  Founders, quants, and builders get an objective third-party view—no
                  lock-in. Compare Pred and Kash to Kalshi and Polymarket on
                  headline metrics.
                </p>
              </div>
              <Link
                href="/benchmarks"
                className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-primary/20 bg-surface text-sm font-medium text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                View benchmarks &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Use Cases & Audiences */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 border-t border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-10">
                Use this to
              </h2>
              <ul className="space-y-8">
                <li className="flex gap-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Show investors your liquidity vs incumbents</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">Benchmarks and exportable charts.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Spot unhealthy or whale-dominated markets</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">Health score, Gini, top wallets.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Compare your spreads and depth to Kalshi and Polymarket</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">Benchmark view and methodology.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-10">
                Who it&apos;s for
              </h2>
              <ul className="space-y-8">
                <li className="flex gap-5 border-l-2 border-primary/10 pl-5">
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Founders / Execs</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">High-level KPIs and comparisons vs incumbents.</p>
                  </div>
                </li>
                <li className="flex gap-5 border-l-2 border-primary/10 pl-5">
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Quant / Product</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">Flexible queries on spreads, depth, cohorts.</p>
                  </div>
                </li>
                <li className="flex gap-5 border-l-2 border-primary/10 pl-5">
                  <div>
                    <h4 className="text-base font-medium text-primary mb-2">Builders</h4>
                    <p className="text-sm text-primary/60 leading-relaxed">Coherent system explainable in 15–30 min.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 border-t border-primary/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                Data sources
              </h2>
              <p className="text-lg text-primary/60">Raw chain and API tracking for leading platforms.</p>
            </div>
            <Link
              href="/benchmarks"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/70 transition-colors"
            >
              Compare all platforms (Benchmarks) &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Pred",
                desc: "Base-native order-book sports prediction exchange.",
                slug: "pred",
                href: "/markets?platform=pred",
              },
              {
                name: "Kash",
                desc: "Social-native AMM on X via @kash_bot.",
                slug: "kash",
                href: "/markets?platform=kash",
              },
              {
                name: "Kalshi",
                desc: "Incumbent benchmark.",
                slug: "kalshi",
                href: "/markets?platform=kalshi",
              },
              {
                name: "Polymarket",
                desc: "Incumbent benchmark.",
                slug: "polymarket",
                href: "/markets?platform=polymarket",
              },
            ].map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="group flex flex-col justify-between rounded-2xl border border-primary/10 bg-primary/[0.01] p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div>
                  <h3 className="text-lg font-medium text-primary mb-3 group-hover:text-blue-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-primary/60 leading-relaxed mb-8">{p.desc}</p>
                </div>
                <div className="flex items-center text-sm font-medium text-primary/50 group-hover:text-blue-500 transition-colors">
                  View markets
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Key Metrics */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 border-t border-primary/5">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Key metrics
            </h2>
            <p className="text-lg text-primary/60 max-w-2xl">
              Institutional-grade metrics calculated objectively across all tracked platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {[
              {
                title: "Spreads",
                detail: "Top-of-book (best ask − best bid) in bps. From order book (Pred) or implied from curve (Kash).",
              },
              {
                title: "Depth",
                detail: "Size at top 1 and top 5 levels (bid/ask). For Kash, approximated from the curve.",
              },
              {
                title: "Volume & participation",
                detail: "Notional, trade count, unique traders. Gini participation for concentration.",
              },
              {
                title: "Whale vs retail",
                detail: "Trader daily stats to spot whale-dominated markets and wash-trading patterns.",
              },
              {
                title: "Social (Kash)",
                detail: "Engagement and sentiment; linked to markets via social_market_links.",
              },
              {
                title: "Benchmarks",
                detail: "Compare Pred/Kash to Kalshi and Polymarket.",
              },
            ].map((m, i) => (
              <div key={i} className="group relative">
                <div className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.04] text-sm font-medium text-primary/70 border border-primary/10">
                  {i + 1}
                </div>
                <h3 className="text-lg font-medium text-primary mb-3">{m.title}</h3>
                <p className="text-sm text-primary/60 leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="border-t border-primary/10 bg-primary/[0.02] py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-balance">
              Ready to explore?
            </h2>
            <p className="text-lg md:text-xl text-primary/60 max-w-2xl mb-12 text-balance leading-relaxed">
              Open the market explorer, filter by platform, and inspect liquidity
              and participants. Export CSV per market via the API.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16 w-full max-w-xl">
              <Link
                href="/markets"
                className="flex-1 sm:flex-none inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-surface transition-transform hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-lg shadow-primary/10"
              >
                Open market explorer
              </Link>
              <Link
                href="/markets?platform=pred"
                className="flex-1 sm:flex-none inline-flex h-14 items-center justify-center rounded-xl border border-primary/10 bg-surface px-8 text-base font-medium text-primary transition-all hover:bg-primary/5 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Pred markets
              </Link>
              <Link
                href="/markets?platform=kash"
                className="flex-1 sm:flex-none inline-flex h-14 items-center justify-center rounded-xl border border-primary/10 bg-surface px-8 text-base font-medium text-primary transition-all hover:bg-primary/5 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Kash markets
              </Link>
            </div>
            
            <div className="w-full max-w-4xl border-t border-primary/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-primary/50">
              <p>
                <strong className="text-primary/70 font-medium">Not affiliated</strong> with Pred, Kash, or any incumbent. Independent third-party analytics.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-left">
                <span>Data: market_daily_aggregates, market_liquidity_snapshots...</span>
                <code className="bg-primary/5 border border-primary/10 px-2 py-1 rounded text-xs text-primary/70 font-mono">
                  /api/export/market/[id]/daily
                </code>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
