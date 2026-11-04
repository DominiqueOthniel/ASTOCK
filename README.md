# Astock

Astock is a bulk liquidation marketplace for selling and buying retail returns, overstock, pallets, and truckloads. It includes a public site and an admin back office backed by PostgreSQL via Prisma.

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
- Prisma + PostgreSQL (Prisma Postgres, Neon, Vercel Postgres, etc.)
- jose session cookies + bcryptjs passwords

## Environment

Copy `.env.example` to `.env` and set a PostgreSQL `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"
ADMIN_EMAIL="admin@astock.market"
ADMIN_PASSWORD="astock-admin-demo"
SESSION_SECRET="astock-dev-session-secret-change-in-production"
COOKIE_SECURE="false"
```

Set `COOKIE_SECURE=true` behind HTTPS in production. On Vercel also set the same vars for Production.

### Admin defaults

- Email: `admin@astock.market`
- Password: `astock-admin-demo`

## Run locally

```bash
pnpm install
pnpm db:setup
pnpm dev
```

`pnpm db:setup` runs `prisma db push` and seeds 22 lots plus the admin user from `prisma/seed-lots.json`.

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Also works with npm:

```bash
npm install
npm run db:setup
npm run dev
```

Production build:

```bash
pnpm build
pnpm exec next start -H 0.0.0.0 -p 3000
```

## Project layout

- `src/app/(site)` public routes: `/`, `/browse`, `/lots/[slug]`, `/sell`
- `src/app/admin` login + protected dashboard, lots, inquiries
- `src/app/api/admin` login, logout, lots, inquiries mutations
- `src/components` site UI and `admin/` shell, login, lot form
- `src/lib` prisma, auth, lot service/mapper, format helpers
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/seed-lots.json`

## License

Demo project. Not affiliated with B-Stock or any retailer brands referenced only as category context.
