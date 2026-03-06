# Vercel setup (Liquidity Intelligence Console)

Deploy the **dashboard** (Next.js) from this monorepo on Vercel.

## 1. Connect the repo

- [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**
- Import your Git repository (GitHub/GitLab/Bitbucket)
- **Root Directory**: set to **`apps/dashboard`** (required for this monorepo)
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `next build` (default)
- **Install Command**: `bun install` or `npm install` (Vercel will use Bun if it finds `bun.lockb` in the root; if the Root Directory is `apps/dashboard`, ensure that folder has its own lockfile or adjust Install Command to run from repo root if needed)

If the repo root is connected instead of `apps/dashboard`, go to **Project Settings → General → Root Directory**, set it to **apps/dashboard**, and save.

## 2. Environment variables

The dashboard needs Supabase for the API. Add these in **Project Settings → Environment Variables**:

| Name | Value | Environments |
|------|--------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon (public) key | Production, Preview |

Copy the values from `apps/dashboard/.env` (or Supabase Dashboard → Project Settings → API).

**Option A – Dashboard:** Paste the two variables in the Vercel UI and save.

**Option B – CLI (from repo root, after `vercel link`):**

```bash
bun run vercel:env
```

Then trigger a **Redeploy** so the new env vars are used (Deployments → ⋯ → Redeploy).

## 3. Deploy

- **Automatic:** Push to the connected branch; Vercel deploys.
- **Manual:** `vercel` or `vercel --prod` from repo root (with Root Directory set to `apps/dashboard`, the linked project will build the dashboard).

## 4. Optional: CLI link from repo root

To use `vercel` and `vercel env` from the repo:

```bash
cd /path/to/Liquidity-Intelligence-Console
vercel login
vercel link
```

When prompted, choose the existing project or create one. **Root Directory** for that project must be **apps/dashboard** (set in the Vercel Dashboard as above; the CLI uses the linked project).

## Troubleshooting

- **“fetch failed” / no data:** Env vars are missing or wrong. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel, then redeploy.
- **Build fails:** Confirm Root Directory is `apps/dashboard` and that `next build` runs there (e.g. Install from repo root with `bun install` and Build `bun run build` if you use root as Root Directory; or keep Root Directory as `apps/dashboard` and use default install/build).
- **Preview vs Production:** Use the same two env vars for both so preview deployments work.
