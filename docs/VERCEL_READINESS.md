# Vercel Readiness

This document summarizes the production readiness of this app for Vercel.

## Environment Variables

| Name | Scope | Description | Required |
|------|-------|-------------|----------|
| DATABASE_URL | server | Postgres pooled DSN | prod, preview, dev |
| NEXT_PUBLIC_SUPABASE_URL | client+server | Supabase project URL | all |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | client+server | Supabase anon key | all |
| SUPABASE_SERVICE_ROLE_KEY | server | Supabase service role (server-only) | prod, preview |
| NEXTAUTH_SECRET | server | Auth secret (if using NextAuth) | prod, preview |
| NEXTAUTH_URL | server | Site URL for NextAuth | prod |
| NEXT_PUBLIC_DEFAULT_LOCALE | client | Default locale | all |
| NEXT_PUBLIC_STORAGE_BUCKET | client | Storage bucket name | all |

Notes:
- Never expose `SUPABASE_SERVICE_ROLE_KEY` on the client.
- Use Supabase pooled DSN (`?pgbouncer=true&sslmode=require&connection_limit=1`).

## Auth/RBAC
- Roles enforced server-side based on DB user roles.
- No backdoors or master passwords.
- Admin actions are logged to audit tables.

## Database & Prisma
- Prisma singleton implemented in `lib/prisma.ts`.
- Use pooled DSN in `DATABASE_URL` for Vercel Serverless.
- Run migrations in CI or manually before first deploy.

## Build & Runtime
- Runtime defaults to Node where APIs require it.
- Images allowed: `localhost`, `supabase.co`.
- ISR/Cache can be added per route as needed.

## OBS Overlays
- Overlay pages render via App Router pages under `/[locale]/obs/*`.
- Ensure `Cache-Control` headers or revalidation as needed per overlay.

## i18n
- `next-intl` middleware configured in `middleware.ts`.
- Locales: `en`, `it`. Ensure translations in `messages/`.

## Security / A11y / Perf Checklist
- No secrets in client bundles.
- CORS headers for API set in `vercel.json`.
- ESLint + TypeScript strict mode enabled.


