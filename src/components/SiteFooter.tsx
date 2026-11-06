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
      <div className="site-grid grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">Astock</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Bulk liquidation marketplace for pallets, truckloads, and mixed lots.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Marketplace
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse lots
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-white">
                Sell with us
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Contact
          </p>
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
                <li className="leading-relaxed text-white/70">{settings.addressNote}</li>
              ) : null}
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/55">Contact details coming soon.</p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-grid flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© 2026 Astock. Bulk liquidation marketplace.</p>
          <p>Purchase requests are confirmed by email with Astock ops.</p>
        </div>
      </div>
    </footer>
  );
}
