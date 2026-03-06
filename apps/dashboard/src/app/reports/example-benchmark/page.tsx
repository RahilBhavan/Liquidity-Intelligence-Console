import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ExampleBenchmarkReportPage() {
  const cwd = process.cwd();
  const paths = [
    join(cwd, "docs", "reports", "example-benchmark-report.md"),
    join(cwd, "..", "..", "docs", "reports", "example-benchmark-report.md"),
  ];
  let content = "*Report file not found. See docs/reports/example-benchmark-report.md in the repository.*";
  for (const p of paths) {
    try {
      content = readFileSync(p, "utf-8");
      break;
    } catch {
      continue;
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-4xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: "Example benchmark", href: undefined },
          ]}
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <pre className="whitespace-pre-wrap font-sans text-sm text-primary/90 bg-primary/[0.02] border border-primary/10 rounded-lg p-6 overflow-x-auto">
            {content}
          </pre>
        </div>

        <p className="mt-6 text-sm text-primary/60">
          <Link href="/reports" className="font-medium text-primary/80 hover:text-primary underline">
            ← Back to reports
          </Link>
        </p>
      </main>
    </div>
  );
}
