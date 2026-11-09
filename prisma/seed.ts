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
  startingBid: number;
  reserveMet: boolean;
  bidCount: number;
  unitCount: number;
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
      startingBid: lot.startingBid,
      reserveMet: lot.reserveMet,
      bidCount: lot.bidCount,
      unitCount: lot.unitCount,
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

  console.log(`Seeded admin ${email}, site settings, and ${lots.length} lots.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
