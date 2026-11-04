import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getMarketplaceUser } from "@/lib/supabase/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMarketplaceUser();

  return (
    <>
      <SiteHeader email={user?.email ?? null} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
