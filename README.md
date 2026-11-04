# Astock

Astock is a bulk liquidation marketplace for selling and buying retail returns, overstock, pallets, and truckloads. It includes a public site and an admin back office backed by **Supabase Postgres** via Prisma.

## Features

- Marketing landing page with full-bleed warehouse hero
- Browse lots with search, filters, and sort (live from the database)
- Lot detail pages with gallery, manifest, condition notes, shipping/pickup, and bid or buy-now actions
- Sell with us intake that stores inquiries for admin review
- Admin back office at `/admin` for lots CRUD, publish controls, and inquiry inbox

Demo bidding and buy-now update the database. No real payments are processed.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + Supabase Postgres
- jose session cookies + bcryptjs for `/admin` (Supabase Auth not required yet)
- Optional `@supabase/supabase-js` scaffold in `src/lib/supabase.ts` for Auth/Storage later

## Environment

Copy `.env.example` to `.env`. For Supabase you need **both** pooled and direct database URLs:

```bash
# Transaction pooler (Vercel / serverless) — port 6543
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct (migrations / db push) — port 5432
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

ADMIN_EMAIL="admin@astock.market"
ADMIN_PASSWORD="astock-admin-demo"
SESSION_SECRET="astock-dev-session-secret-change-in-production"
COOKIE_SECURE="false"
```

Find connection strings in Supabase → **Project Settings → Database → Connection string**.

Set `COOKIE_SECURE=true` on Vercel. Also set `DATABASE_URL`, `DIRECT_URL`, admin vars, and the public Supabase URL/anon key on the Vercel project.

### Admin defaults

- Email: `admin@astock.market`
- Password: `astock-admin-demo`

## Run locally

```bash
pnpm install
pnpm db:setup
pnpm dev
```

`pnpm db:setup` runs `prisma db push` (uses `DIRECT_URL`) and seeds 22 lots plus the admin user from `prisma/seed-lots.json`.

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Production (Vercel + Supabase)

1. Create/link a Supabase project and copy pooled + direct Postgres URLs.
2. Set env on Vercel project `astock` (domain `astock-one.vercel.app`).
3. From a machine with the URLs: `pnpm db:setup`.
4. Deploy: `vercel deploy --prod` (Git auto-deploy may be disabled on the project).

Live: [https://astock-one.vercel.app](https://astock-one.vercel.app)

## Project layout

- `src/app/(site)` public routes: `/`, `/browse`, `/lots/[slug]`, `/sell`
- `src/app/admin` login + protected dashboard, lots, inquiries
- `src/app/api/admin` login, logout, lots, inquiries mutations
- `src/components` site UI and `admin/` shell, login, lot form
- `src/lib` prisma, auth, supabase scaffold, lot service/mapper, format helpers
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/seed-lots.json`

## License

Demo project. Not affiliated with B-Stock or any retailer brands referenced only as category context.
