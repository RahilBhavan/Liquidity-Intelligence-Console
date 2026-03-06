"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [dataAsOf, setDataAsOf] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((res) => {
        const asOf = res.data?.dataAsOf;
        if (asOf) {
          try {
            const d = new Date(asOf);
            setDataAsOf(d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }));
          } catch {
            setDataAsOf(asOf);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-surface/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-12"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm font-semibold text-primary focus-ring rounded px-2 py-1 -ml-2"
        >
          Liquidity Intelligence Console
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium focus-ring rounded px-2 py-1 ${
              pathname === "/" ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            Overview
          </Link>
          <Link
            href="/markets"
            className={`text-sm font-medium focus-ring rounded px-2 py-1 ${
              pathname.startsWith("/markets") ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            Markets
          </Link>
          <Link
            href="/benchmarks"
            className={`text-sm font-medium focus-ring rounded px-2 py-1 ${
              pathname.startsWith("/benchmarks") ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            Benchmarks
          </Link>
          <Link
            href="/reports"
            className={`text-sm font-medium focus-ring rounded px-2 py-1 ${
              pathname.startsWith("/reports") ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            Reports
          </Link>
          <Link
            href="/docs"
            className={`text-sm font-medium focus-ring rounded px-2 py-1 ${
              pathname.startsWith("/docs") ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            Docs
          </Link>
          {dataAsOf && (
            <span className="text-xs text-primary/50" title="Latest data timestamp">
              Data as of {dataAsOf}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
