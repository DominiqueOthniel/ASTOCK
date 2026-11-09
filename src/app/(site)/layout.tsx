import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { readCart } from "@/lib/cart";
import { getMarketplaceUser } from "@/lib/supabase/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, cart] = await Promise.all([getMarketplaceUser(), readCart()]);
  const cartCount = cart.reduce((sum, item) => sum + Math.max(1, item.quantity || 1), 0);

  return (
    <SiteChrome email={user?.email ?? null} cartCount={cartCount}>
      <main className="flex-1 page-enter">{children}</main>
      <SiteFooter />
    </SiteChrome>
  );
}
