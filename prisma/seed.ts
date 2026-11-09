import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

type SeedLot = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  condition: string;
  lotType: string;
  saleType: string;
  currentBid: number;
  buyNowPrice?: number | null;
  compareAtPrice?: number | null;
  bulkTiers?: { minQuantity: number; unitPrice: number }[];
  startingBid: number;
  reserveMet: boolean;
  bidCount: number;
  unitCount: number;
  quantitySold?: number;
  minQuantity?: number;
  sellByUnit?: boolean;
  estimatedRetail: number;
  location: string;
  endsAt: string;
  featured?: boolean;
  published?: boolean;
  images: string[];
  manifestSummary: string;
  conditionNotes: string;
  sellerNotes: string;
  shipping: string;
  pickup: string;
};

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@astock.market";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD must be set to seed the admin user");
  }
  const passwordHash = await hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      contactEmail: "uncledrewlegacy@gmail.com",
      contactPhone: "",
      whatsapp: "+12404009904",
      addressNote: "",
      facebookUrl: "https://www.facebook.com/share/1FVCpM6JYi/",
      instagramUrl: "https://www.instagram.com/palletplugdeals",
      tiktokUrl: "https://www.tiktok.com/@palletplugdeals",
      linkedinUrl: "",
      xUrl: "",
      minOrderTotalCents: 15000,
    },
    create: {
      id: "default",
      contactEmail: "uncledrewlegacy@gmail.com",
      contactPhone: "",
      whatsapp: "+12404009904",
      addressNote: "",
      facebookUrl: "https://www.facebook.com/share/1FVCpM6JYi/",
      instagramUrl: "https://www.instagram.com/palletplugdeals",
      tiktokUrl: "https://www.tiktok.com/@palletplugdeals",
      linkedinUrl: "",
      xUrl: "",
      minOrderTotalCents: 15000,
    },
  });

  const seedPath = join(__dirname, "seed-lots.json");
  const lots = JSON.parse(readFileSync(seedPath, "utf8")) as SeedLot[];

  for (const lot of lots) {
    const data = {
      slug: lot.slug,
      title: lot.title,
      category: lot.category,
      condition: lot.condition,
      lotType: lot.lotType,
      saleType: lot.saleType,
      currentBid: lot.currentBid,
      buyNowPrice: lot.buyNowPrice ?? null,
      compareAtPrice: lot.compareAtPrice ?? null,
      bulkTiersJson:
        Array.isArray(lot.bulkTiers) && lot.bulkTiers.length > 0
          ? JSON.stringify(lot.bulkTiers)
          : null,
      startingBid: lot.startingBid,
      reserveMet: lot.reserveMet,
      bidCount: lot.bidCount,
      unitCount: lot.unitCount,
      quantitySold: lot.quantitySold ?? 0,
      minQuantity: lot.minQuantity ?? 1,
      sellByUnit: lot.sellByUnit ?? false,
      estimatedRetail: lot.estimatedRetail,
      location: lot.location,
      endsAt: new Date(lot.endsAt),
      featured: lot.featured ?? false,
      published: lot.published ?? true,
      imagesJson: JSON.stringify(lot.images),
      manifestSummary: lot.manifestSummary,
      conditionNotes: lot.conditionNotes,
      sellerNotes: lot.sellerNotes,
      shipping: lot.shipping,
      pickup: lot.pickup,
    };

    if (lot.id) {
      await prisma.lot.upsert({
        where: { id: lot.id },
        update: data,
        create: { id: lot.id, ...data },
      });
    } else {
      await prisma.lot.upsert({
        where: { slug: lot.slug },
        update: data,
        create: data,
      });
    }
  }

  type SeedReview = {
    id: string;
    lotId: string;
    authorName: string;
    rating: number;
    body: string;
    verified?: boolean;
    hoursAgo: number;
  };

  const reviewPath = join(__dirname, "seed-reviews.json");
  const reviews = JSON.parse(readFileSync(reviewPath, "utf8")) as SeedReview[];
  const now = Date.now();

  for (const review of reviews) {
    const createdAt = new Date(now - Math.max(0, review.hoursAgo) * 3600_000);
    await prisma.review.upsert({
      where: { id: review.id },
      update: {
        lotId: review.lotId,
        authorName: review.authorName,
        rating: review.rating,
        body: review.body,
        verified: review.verified ?? false,
        createdAt,
      },
      create: {
        id: review.id,
        lotId: review.lotId,
        authorName: review.authorName,
        rating: review.rating,
        body: review.body,
        verified: review.verified ?? false,
        createdAt,
      },
    });
  }

  console.log(
    `Seeded admin ${email}, site settings, ${lots.length} lots, and ${reviews.length} reviews.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
