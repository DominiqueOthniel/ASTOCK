import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { readCart } from "@/lib/cart";
import { getMarketplaceUser } from "@/lib/supabase/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, cart] = await Promise.all([getMarketplaceUser(), readCart()]);

  return (
    <>
      <SiteHeader email={user?.email ?? null} cartCount={cart.length} />
      <main className="flex-1 page-enter">{children}</main>
      <SiteFooter />
    </>
  );
}
