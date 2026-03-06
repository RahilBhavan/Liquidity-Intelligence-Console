# Supabase setup via MCP

This project uses the **Supabase MCP** (Model Context Protocol) server to manage your Supabase project from Cursor.

## Current project

| Field   | Value |
|--------|--------|
| **Project** | liquiditymanager |
| **Project ID** | `lwzsgyukwxlonfgcchif` |
| **Region** | us-east-1 |
| **Status** | ACTIVE_HEALTHY |
| **API URL** | `https://lwzsgyukwxlonfgcchif.supabase.co` |

## Env configuration

1. Copy env examples and fill keys:
   - Root: `cp .env.example .env`
   - Dashboard: `cp apps/dashboard/.env.example apps/dashboard/.env`

2. **Anon / publishable key** (client-safe):
   - In Cursor, ask the agent to call **Supabase MCP → get_publishable_keys** with `project_id: lwzsgyukwxlonfgcchif`, or
   - Supabase Dashboard → Project Settings → API → anon public / publishable key.

3. **Service role key** (server-only, never in client):
   - Dashboard → Project Settings → API → service_role (not exposed via MCP).

## Useful MCP tools

Use these via Cursor (Supabase MCP):

| Task | Tool |
|------|------|
| List projects | `list_projects` |
| Get project URL | `get_project_url` (project_id: `lwzsgyukwxlonfgcchif`) |
| Get anon/publishable keys | `get_publishable_keys` (project_id: `lwzsgyukwxlonfgcchif`) |
| Run SQL | `execute_sql` (project_id + query) |
| List tables | `list_tables` (project_id) |
| List migrations | `list_migrations` (project_id) |
| Apply migration | `apply_migration` (project_id + migration) |
| Generate TypeScript types | `generate_typescript_types` (project_id) |
| Edge functions | `list_edge_functions`, `deploy_edge_function` |
| Branches | `list_branches`, `create_branch`, `merge_branch` |

## Local Supabase (optional)

For local dev you can use the Supabase CLI and `supabase/config.toml`:

```bash
supabase start   # start local Postgres + Studio
supabase link --project-ref lwzsgyukwxlonfgcchif  # link to cloud project
supabase db push # push migrations to cloud
```

MCP can run SQL and apply migrations directly against the cloud project without linking.
