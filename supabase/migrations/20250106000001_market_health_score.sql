-- Market health score (0-100) on market_daily_aggregates
-- Formula: weighted sum of percentile-based components per (platform_id, date).
-- Components: spread (lower better), depth (higher better), volume (higher better), participation (1 - gini, higher better).
-- Weights: 30% spread, 25% depth, 25% volume, 20% participation.
-- See docs/METHODOLOGY.md § Market health score.

ALTER TABLE market_daily_aggregates
  ADD COLUMN IF NOT EXISTS health_score numeric;

COMMENT ON COLUMN market_daily_aggregates.health_score IS
  'Market health 0-100: weighted percentiles of spread (inverted), depth, volume, participation (1-gini) within (platform_id, date).';

-- Backfill: compute health_score from percentiles per (platform_id, date).
-- Run once after migration; re-run after new data is loaded (e.g. from analytics job or cron).
WITH ranked AS (
  SELECT
    id,
    -- Spread: lower is better → score = 1 - percent_rank (asc = small spread first)
    (1 - PERCENT_RANK() OVER (PARTITION BY platform_id, date ORDER BY avg_spread ASC NULLS LAST)) AS spread_score,
    -- Depth: higher is better → score = percent_rank (desc = large depth first)
    PERCENT_RANK() OVER (PARTITION BY platform_id, date ORDER BY (COALESCE(max_depth_bid_5, 0) + COALESCE(max_depth_ask_5, 0)) DESC NULLS LAST) AS depth_score,
    -- Volume: higher is better
    PERCENT_RANK() OVER (PARTITION BY platform_id, date ORDER BY total_volume DESC NULLS LAST) AS volume_score,
    -- Participation: 1 - gini, higher is better; null gini treated as 1 (worst)
    PERCENT_RANK() OVER (PARTITION BY platform_id, date ORDER BY (1 - COALESCE(gini_participation, 1)) DESC NULLS LAST) AS participation_score
  FROM market_daily_aggregates
)
UPDATE market_daily_aggregates m
SET health_score = LEAST(100, GREATEST(0,
  (r.spread_score * 0.30 + r.depth_score * 0.25 + r.volume_score * 0.25 + r.participation_score * 0.20) * 100
))
FROM ranked r
WHERE m.id = r.id;

-- Ongoing updates: re-run the same backfill logic (CTE + UPDATE) for new (platform_id, date) rows
-- from the market-daily analytics job after it inserts new market_daily_aggregates, or run a
-- scheduled job that updates health_score for rows where health_score IS NULL or date >= today - 1.
