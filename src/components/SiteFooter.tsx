import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  getSiteSettings,
  normalizeWhatsApp,
  publicSocialLinks,
} from "@/lib/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = publicSocialLinks(settings);
  const hasContact = Boolean(settings.contactEmail) || socials.length > 0;

  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="site-grid grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo onDark size="md" className="text-white" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Fixed-price liquidation pallets, toys, electronics, and Christmas trees at
            palletdealsshop.com.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse lots
              </Link>
            </li>
            <li>
              <Link href="/browse?category=Toys" className="hover:text-white">
                Toys pallets
              </Link>
            </li>
            <li>
              <Link href="/browse?category=Christmas" className="hover:text-white">
                Christmas trees
              </Link>
            </li>
            <li>
              <Link href="/browse?category=Electronics" className="hover:text-white">
                Electronics
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-white">
                Sell
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Contact</p>
          {hasContact ? (
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {settings.contactEmail ? (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                    {settings.contactEmail}
                  </a>
                </li>
              ) : null}
              {settings.whatsapp ? (
                <li>
                  <a
                    href={normalizeWhatsApp(settings.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    WhatsApp +1 (240) 400-9904
                  </a>
                </li>
              ) : null}
              {socials
                .filter((link) => link.label !== "WhatsApp")
                .map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/55">Contact soon.</p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-grid py-5 text-xs text-white/45">© 2026 PalletDealsShop</div>
      </div>
    </footer>
  );
}
