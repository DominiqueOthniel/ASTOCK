import type { Metadata } from "next";
import { CartCheckout } from "@/components/CartCheckout";
import { readCart } from "@/lib/cart";
import { listPublishedLots } from "@/lib/lot-service";
import { getSiteSettings } from "@/lib/site-settings";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review lots and request an email order on PalletDeals.",
};

export default async function CartPage() {
  const [cart, lots, user, settings] = await Promise.all([
    readCart(),
    listPublishedLots(),
    getMarketplaceUser(),
    getSiteSettings(),
  ]);
  const bySlug = new Map(lots.map((lot) => [lot.slug, lot]));
  const lines = cart
    .map((item) => {
      const lot = bySlug.get(item.slug);
      if (!lot || lot.status === "sold") return null;
      return { lot, quantity: item.quantity };
    })
    .filter((line): line is { lot: (typeof lots)[number]; quantity: number } => Boolean(line));

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <h1 className="font-display text-4xl font-semibold text-ink">Cart</h1>
        <p className="mt-2 text-steel">Review, then request order. $150 minimum.</p>
        <div className="mt-8">
          <CartCheckout
            lines={lines}
            signedIn={Boolean(user?.email)}
            minOrderTotalCents={settings.minOrderTotalCents}
          />
        </div>
      </div>
    </div>
  );
}
