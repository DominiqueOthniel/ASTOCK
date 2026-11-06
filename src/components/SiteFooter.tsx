import Link from "next/link";
import { getSiteSettings, publicSocialLinks } from "@/lib/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = publicSocialLinks(settings);
  const hasContact =
    Boolean(settings.contactEmail) ||
    Boolean(settings.contactPhone) ||
    Boolean(settings.whatsapp) ||
    Boolean(settings.addressNote);

  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="site-grid grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">Astock</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Bulk liquidation lots with clear prices.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-white">
                Sell
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
          {hasContact || socials.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {settings.contactEmail ? (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                    {settings.contactEmail}
                  </a>
                </li>
              ) : null}
              {settings.contactPhone ? (
                <li>
                  <a
                    href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-white"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              ) : null}
              {settings.addressNote ? (
                <li className="leading-relaxed text-white/65">{settings.addressNote}</li>
              ) : null}
              {socials.map((link) => (
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
        <div className="site-grid py-5 text-xs text-white/45">© 2026 Astock</div>
      </div>
    </footer>
  );
}
