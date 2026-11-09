import Link from "next/link";
import { ensureSiteSettings, getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; error?: string }>;
}) {
  await ensureSiteSettings();
  const settings = await getSiteSettings();
  const params = (await searchParams) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-steel hover:text-accent-deep">
          ← Dashboard
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Contacts &amp; social</h1>
        <p className="mt-2 max-w-2xl text-sm text-steel">
          Public footer contacts and order inbox email. Leave a field blank to hide it.
        </p>
      </div>

      {params.saved ? (
        <p className="border border-accent-soft bg-accent-soft/40 px-3 py-2 text-sm text-ink-soft">
          Settings saved.
        </p>
      ) : null}
      {params.error === "email" ? (
        <p className="border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-ink-soft">
          Enter a valid contact email or leave it blank.
        </p>
      ) : null}
      {params.error === "url" ? (
        <p className="border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-ink-soft">
          Social links must be http(s) URLs. WhatsApp can be a phone number or https://wa.me/…
        </p>
      ) : null}

      <form
        method="post"
        action="/api/admin/settings"
        className="space-y-6 border border-line bg-white p-6 shadow-[var(--shadow)]"
      >
        {/* Keep unused channels cleared on save */}
        <input type="hidden" name="contactPhone" value="" />
        <input type="hidden" name="addressNote" value="" />
        <input type="hidden" name="linkedinUrl" value="" />
        <input type="hidden" name="xUrl" value="" />

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">Contact details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Email (orders inbox)</span>
              <input
                className="field"
                type="email"
                name="contactEmail"
                defaultValue={settings.contactEmail}
                placeholder="uncledrewlegacy@gmail.com"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">WhatsApp</span>
              <input
                className="field"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                placeholder="+12404009904"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 border-t border-line pt-6">
          <h2 className="font-display text-xl font-semibold text-ink">Social</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Facebook URL</span>
              <input
                className="field"
                name="facebookUrl"
                defaultValue={settings.facebookUrl}
                placeholder="https://www.facebook.com/share/…"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Instagram URL</span>
              <input
                className="field"
                name="instagramUrl"
                defaultValue={settings.instagramUrl}
                placeholder="https://www.instagram.com/palletplugdeals"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">TikTok URL</span>
              <input
                className="field"
                name="tiktokUrl"
                defaultValue={settings.tiktokUrl}
                placeholder="https://www.tiktok.com/@palletplugdeals"
              />
            </label>
          </div>
        </section>

        <button type="submit" className="btn btn-primary">
          Save contacts
        </button>
      </form>
    </div>
  );
}
