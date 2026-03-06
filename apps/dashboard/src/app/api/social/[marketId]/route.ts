import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/social/[marketId]
 * Social posts, metrics, and sentiment for Kash markets (via social_market_links).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params;

    const { data: links, error: linksErr } = await supabase
      .from("social_market_links")
      .select("social_post_id, relation_type")
      .eq("market_id", marketId);

    if (linksErr) {
      return NextResponse.json({ error: linksErr.message }, { status: 500 });
    }
    if (!links?.length) {
      return NextResponse.json({ data: { posts: [], metrics: [] } });
    }

    const postIds = [...new Set(links.map((l) => l.social_post_id))];
    const { data: posts, error: postsErr } = await supabase
      .from("social_posts")
      .select("id, platform, external_post_id, author_handle, created_at, text, language, url")
      .in("id", postIds);

    if (postsErr) {
      return NextResponse.json({ error: postsErr.message }, { status: 500 });
    }

    const { data: metrics } = await supabase
      .from("social_metrics")
      .select("social_post_id, timestamp, likes, retweets, quotes, replies, views")
      .in("social_post_id", postIds)
      .order("timestamp", { ascending: false })
      .limit(500);

    const { data: sentiment } = await supabase
      .from("social_sentiment")
      .select("social_post_id, model_name, run_at, sentiment_score, sentiment_label")
      .in("social_post_id", postIds);

    const linkMap = new Map(links.map((l) => [l.social_post_id, l.relation_type]));
    const postsWithRelation = (posts ?? []).map((p) => ({
      ...p,
      relation_type: linkMap.get(p.id) ?? null,
    }));

    return NextResponse.json({
      data: {
        posts: postsWithRelation,
        metrics: metrics ?? [],
        sentiment: sentiment ?? [],
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
