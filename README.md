# Astock

Astock is a bulk liquidation marketplace front end for selling and buying retail returns, overstock, pallets, and truckloads. It is inspired by the category of B-Stock style platforms, with original branding and mock data only.

## Features

- Marketing landing page with full-bleed warehouse hero
- Browse lots with search, filters, and sort
- Lot detail pages with gallery, manifest, condition notes, shipping/pickup, and mock bid or buy-now UI
- Sell with us intake form (demo only)
- Realistic mock catalog across electronics, apparel, home goods, grocery, sporting goods, toys, office, and mixed pallets

No real payments or authentication in this demo.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Also works with npm:

```bash
npm install
npm run dev
```

Production build:

```bash
pnpm build
pnpm exec next start -H 0.0.0.0 -p 3000
```

## Project layout

- `src/app` routes: `/`, `/browse`, `/lots/[id]`, `/sell`
- `src/components` UI pieces (header, footer, browse filters, bid box, gallery)
- `src/lib/lots.ts` mock catalog and helpers

## License

Demo project. Not affiliated with B-Stock or any retailer brands referenced only as category context.
