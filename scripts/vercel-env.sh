#!/usr/bin/env bash
# Push Supabase env vars from apps/dashboard/.env to Vercel (production + preview).
# Run from repo root after: vercel link
set -e
ENV_FILE="${ENV_FILE:-apps/dashboard/.env}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Create it with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  exit 1
fi
add_var() {
  local name="$1"
  local val
  val=$(grep -E "^${name}=" "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')
  if [[ -z "$val" ]]; then
    echo "Skip $name (not found or empty in $ENV_FILE)"
    return 0
  fi
  for env in production preview; do
    echo -n "$val" | vercel env add "$name" "$env"
  done
  echo "Set $name"
}
add_var "NEXT_PUBLIC_SUPABASE_URL"
add_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "Done. Redeploy (Deployments → Redeploy) for env vars to take effect."
