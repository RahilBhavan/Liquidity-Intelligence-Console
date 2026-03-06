"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { SkeletonCards } from "@/components/skeleton-cards";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

type MarketMeta = {
  id: string;
  title: string | null;
  symbol: string | null;
  platformName: string | null;
};

type Post = {
  id: string;
  platform: string;
  external_post_id: string;
  author_handle: string | null;
  created_at: string;
  text: string | null;
  relation_type: string | null;
};

type Metric = {
  social_post_id: string;
  timestamp: string;
  likes: number;
  retweets: number;
  quotes: number;
  replies: number;
  views?: number;
};

export default function SocialViewPage({
  params,
}: {
  params: { marketId: string };
}) {
  const marketId = params.marketId;
  const [market, setMarket] = useState<MarketMeta | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!marketId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/markets/${marketId}`).then((r) => r.json()),
      fetch(`/api/social/${marketId}`).then((r) => r.json()),
    ])
      .then(([metaRes, socialRes]) => {
        if (metaRes.data) setMarket(metaRes.data);
        const d = socialRes.data ?? {};
        setPosts(d.posts ?? []);
        setMetrics(d.metrics ?? []);
        if (socialRes.error) setError(socialRes.error);
      })
      .catch(() => setError("Failed to load social data"))
      .finally(() => setLoading(false));
  }, [marketId]);

  useEffect(() => {
    load();
  }, [load]);

  const metricsByPost = new Map<string, Metric[]>();
  for (const m of metrics) {
    const list = metricsByPost.get(m.social_post_id) ?? [];
    list.push(m);
    metricsByPost.set(m.social_post_id, list);
  }

  const marketTitle =
    market?.title || market?.symbol || (marketId.length > 8 ? `${marketId.slice(0, 8)}…` : marketId);

  return (
    <div className="min-h-screen bg-surface">
      <main id="main" className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <Breadcrumb
          items={[
            { label: "Overview", href: "/" },
            { label: "Markets", href: "/markets" },
            { label: marketTitle, href: `/markets/${marketId}` },
            { label: "Social", href: undefined },
          ]}
        />

        {error && (
          <ErrorState
            message={error}
            onRetry={load}
            backHref={`/markets/${marketId}`}
            backLabel="Back to market"
          />
        )}

        {!error && (
          <>
            <header className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
                Social (Kash) – {marketTitle}
              </h1>
              <p className="mt-1 text-sm text-primary/60">
                Posts linked to this market and engagement metrics
              </p>
            </header>

            {loading && <SkeletonCards count={4} />}

            {!loading && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <EmptyState
                    title="No social posts"
                    description="Populate social_market_links and social_metrics to see posts linked to this market."
                    actionLabel="Back to market"
                    actionHref={`/markets/${marketId}`}
                  />
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-lg border border-primary/10 bg-surface p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-sm text-primary/60">
                        <span>{post.author_handle ?? post.external_post_id}</span>
                        <span>{post.relation_type ?? "—"}</span>
                        <span>
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-primary">{post.text ?? "—"}</p>
                      {metricsByPost.get(post.id)?.length ? (
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-primary/70">
                          {metricsByPost.get(post.id)!.slice(0, 1).map((m) => (
                            <span key={m.timestamp}>
                              Likes {m.likes} · Retweets {m.retweets} ·
                              Replies {m.replies}
                              {m.views != null ? ` · Views ${m.views}` : ""}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
