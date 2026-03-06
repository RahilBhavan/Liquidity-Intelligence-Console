import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Reports", href: undefined },
          ]}
        />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-primary/60">
            Benchmark and liquidity reports you can share or attach for investors.
          </p>
        </header>

        <ul className="space-y-4">
          <li>
            <Link
              href="/reports/example-benchmark"
              className="block rounded-lg border border-primary/10 bg-surface p-4 transition-colors hover:border-primary/20 focus-ring"
            >
              <h2 className="font-semibold text-primary">
                Pred vs Kash vs Kalshi vs Polymarket: Liquidity and Participation
              </h2>
              <p className="mt-1 text-sm text-primary/60">
                Example period — methodology, volume and spread by platform, narrative and caveats.
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-primary/70">
                View report →
              </span>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
