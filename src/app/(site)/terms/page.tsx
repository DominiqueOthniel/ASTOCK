import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "PalletDeals marketplace terms for buyers and sellers of bulk liquidation lots.",
  alternates: { canonical: "https://palletdealsshop.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <article className="site-grid max-w-3xl prose-legal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-steel">Last updated: 6 November 2026</p>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">
          These Terms &amp; Conditions (“Terms”) govern access to and use of the Astock bulk liquidation
          marketplace operated at astock-one.vercel.app and related services (the “Platform”). By creating
          an account, submitting a purchase request, or submitting a seller inquiry, you agree to these
          Terms.
        </p>

        <Section title="1. Platform role">
          Astock provides an online marketplace that lists graded bulk lots such as retail returns,
          overstock, shelf pulls, pallets, and truckloads at a fixed asking price. Astock is a marketplace
          facilitator unless a listing expressly states that Astock is the seller of record. Title, risk,
          and fulfillment obligations for each lot remain with the named seller unless otherwise agreed in
          writing.
        </Section>

        <Section title="2. Eligibility and accounts">
          The Platform is intended for business buyers and sellers with authority to bind their
          organization. You must provide accurate registration information and keep credentials secure.
          You are responsible for all activity under your account. Astock may suspend accounts that
          appear fraudulent, abusive, or non-compliant with these Terms.
        </Section>

        <Section title="3. Lot descriptions and as-is sales">
          Listings include category, condition grade, unit counts, estimated retail value, location,
          manifests, and logistics notes for informational purposes. Condition grades (including A
          through C, customer returns, and shelf pulls) describe general merchandising quality and do
          not guarantee fitness for any particular resale channel. Unless a listing expressly states
          otherwise, lots are offered <strong>as-is, where-is</strong>, with all faults, and without
          warranty of merchantability or fitness for a particular purpose. Buyers should review
          manifests and request inspection access before ordering when inspection is material to their
          decision.
        </Section>

        <Section title="4. Purchase requests and payment">
          Lots are offered at a fixed asking price. Buyers may add lots to a cart and place an email
          order, or request purchase on a single lot. Submitting a purchase request creates an order
          record and notifies Astock operations. A purchase request is an offer to buy at the stated
          amount; it becomes a binding purchase when Astock or the seller confirms acceptance by email
          or other written confirmation. Payment instructions, deposits, wire details, and timelines
          will be provided during confirmation. Astock does not process card checkout on the Platform
          unless a listing expressly states otherwise.
        </Section>

        <Section title="5. Shipping, pickup, and transfer of risk">
          Lots remain at the stated warehouse until released. Buyers are responsible for arranging
          freight, LTL, or dock appointments unless the listing states that the seller will arrange
          shipping for a quoted fee. Risk of loss transfers upon release to the buyer’s carrier or upon
          completion of scheduled pickup, whichever occurs first. Storage fees may apply if lots are not
          removed within the agreed release window.
        </Section>

        <Section title="6. Seller listings and inquiries">
          Sellers represent that they have lawful title and authority to sell listed inventory, that
          listings are not knowingly misleading, and that inventory is free of undisclosed hazardous
          materials except as stated. Seller inquiries submitted through the Platform authorize Astock
          to contact the seller about onboarding, grading, manifests, and listing logistics.
        </Section>

        <Section title="7. Prohibited conduct">
          You may not scrape the Platform beyond ordinary browsing, misrepresent identity or authority,
          list illegal goods, or use the Platform to harass other users. Astock may remove listings and
          suspend access for violations.
        </Section>

        <Section title="8. Limitation of liability">
          To the fullest extent permitted by law, Astock is not liable for indirect, incidental,
          special, consequential, or lost-profit damages arising from use of the Platform or from lot
          condition after sale. Astock’s aggregate liability related to any lot or transaction shall
          not exceed the marketplace fees actually paid to Astock for that transaction, if any.
        </Section>

        <Section title="9. Indemnity">
          You agree to indemnify and hold harmless Astock and its operators from claims arising out of
          your breach of these Terms, your listings, your purchase requests, or your failure to comply
          with applicable law.
        </Section>

        <Section title="10. Privacy">
          Personal and business contact data is handled as described in the{" "}
          <Link href="/privacy" className="font-semibold text-accent-deep hover:underline">
            Privacy Policy
          </Link>
          .
        </Section>

        <Section title="11. Changes and governing framework">
          Astock may update these Terms by posting a revised version on the Platform. Continued use
          after the posted update constitutes acceptance of the revised Terms for subsequent activity.
          These Terms are governed by the laws applicable to Astock’s principal place of business,
          without regard to conflict-of-law rules, unless a written seller or buyer agreement states
          otherwise for a specific lot.
        </Section>

        <Section title="12. Contact">
          Questions about these Terms:{" "}
          <a href="mailto:uncledrewlegacy@gmail.com" className="font-semibold text-accent-deep hover:underline">
            uncledrewlegacy@gmail.com
          </a>
          .
        </Section>

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-steel">
          This page is a working template for Astock’s marketplace and is not a substitute for advice
          from qualified counsel. Have counsel review these Terms before relying on them for high-value
          or regulated inventory programs.
        </p>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
