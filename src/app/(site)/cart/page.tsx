import type { Metadata } from "next";
import { CartCheckout } from "@/components/CartCheckout";
import { readCart } from "@/lib/cart";
import { listPublishedLots } from "@/lib/lot-service";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review lots and request an email order on Astock.",
};

export default async function CartPage() {
  const [cart, lots, user] = await Promise.all([
    readCart(),
    listPublishedLots(),
    getMarketplaceUser(),
  ]);
  const slugSet = new Set(cart.map((item) => item.slug));
  const cartLots = lots.filter((lot) => slugSet.has(lot.slug) && lot.status !== "sold");

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <h1 className="font-display text-4xl font-semibold text-ink">Cart</h1>
        <p className="mt-2 text-steel">Review, then request order.</p>
        <div className="mt-8">
          <CartCheckout lots={cartLots} signedIn={Boolean(user?.email)} />
        </div>
      </div>
    </div>
  );
}
