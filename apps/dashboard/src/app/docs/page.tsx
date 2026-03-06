import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";

/**
 * In-app docs: API overview, methodology summary, and data & privacy.
 * Full details live in the repository docs/ folder (METHODOLOGY.md, API.md, DATA_AND_PRIVACY.md).
 */
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Docs", href: undefined },
          ]}
        />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            Documentation
          </h1>
          <p className="mt-1 text-sm text-primary/60">
            API reference, methodology, and data handling. Full docs are in the repository <code className="bg-primary/5 px-1 rounded text-xs">docs/</code> folder.
          </p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-primary border-b border-primary/10 pb-2 mb-3">
              API reference
            </h2>
            <p className="text-sm text-primary/70 mb-4">
              All endpoints return JSON unless noted (CSV for export). Base URL is the same origin as this dashboard.
            </p>
            <ul className="list-none space-y-2 text-sm">
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/status</code> — Data freshness &amp; health</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/markets</code> — List markets (platform, category, limit, offset)</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/markets/[id]</code> — Market metadata</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/markets/[id]/liquidity</code> — Liquidity time-series (from, to, limit)</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/markets/[id]/participants</code> — Top wallets by volume (limit)</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/social/[marketId]</code> — Social posts &amp; metrics (Kash)</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/benchmarks</code> — Platform metrics (from, to)</li>
              <li><code className="bg-primary/5 px-1.5 py-0.5 rounded">GET /api/export/market/[id]/daily</code> — CSV download (from, to)</li>
            </ul>
            <p className="mt-4 text-xs text-primary/50">
              Full reference with query params and response shapes: see <code className="bg-primary/5 px-1 rounded">docs/API.md</code> in the repo. Machine-readable: <code className="bg-primary/5 px-1 rounded">docs/openapi.yaml</code> (OpenAPI 3.x).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary border-b border-primary/10 pb-2 mb-3">
              Methodology
            </h2>
            <ul className="space-y-2 text-sm text-primary/80">
              <li><strong className="text-primary">Spreads</strong> — Top-of-book (best ask − best bid) in bps. Pred from order book; Kash implied from bonding curve.</li>
              <li><strong className="text-primary">Depth</strong> — Top 1 and top 5 levels (bid/ask). Kash approximated from curve.</li>
              <li><strong className="text-primary">Volume &amp; participation</strong> — Notional, trade count, unique traders from <code className="bg-primary/5 px-1 rounded text-xs">market_daily_aggregates</code> and snapshots.</li>
              <li><strong className="text-primary">Gini participation</strong> — 0 = even; 1 = one wallet dominates. <code className="bg-primary/5 px-1 rounded text-xs">market_daily_aggregates.gini_participation</code>.</li>
              <li><strong className="text-primary">Data freshness</strong> — Snapshots typically every 15m; daily aggregates run once per day (e.g. 00:00 UTC).</li>
            </ul>
            <p className="mt-4 text-xs text-primary/50">
              Full definitions: <code className="bg-primary/5 px-1 rounded">docs/METHODOLOGY.md</code>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary border-b border-primary/10 pb-2 mb-3">
              Data &amp; privacy
            </h2>
            <p className="text-sm text-primary/80">
              Data is stored in Postgres (Supabase). We use on-chain data (addresses, transactions) and API-sourced data (Kalshi, Polymarket, public social metrics). No PII beyond what is already public. Secrets are in environment variables; we do not share data with third parties.
            </p>
            <p className="mt-4 text-xs text-primary/50">
              Full note: <code className="bg-primary/5 px-1 rounded">docs/DATA_AND_PRIVACY.md</code>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-primary/10">
          <Link
            href="/"
            className="text-sm font-medium text-primary/70 hover:text-primary focus-ring rounded"
          >
            ← Back to overview
          </Link>
        </div>
      </main>
    </div>
  );
}
