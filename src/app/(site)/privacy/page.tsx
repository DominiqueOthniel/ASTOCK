import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Astock collects and uses account and marketplace data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <article className="site-grid max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-steel">Last updated: 4 November 2026</p>

        <p className="mt-6 text-base leading-relaxed text-ink-soft">
          This Privacy Policy explains how Astock collects, uses, and shares information when you use
          the Astock bulk liquidation marketplace.
        </p>

        <Section title="Information we collect">
          We collect account credentials and contact details you provide (such as email address and,
          for sellers, company and phone), marketplace activity (purchase requests, seller
          inquiries), technical logs needed to operate the service, and communications you send to
          Astock operations.
        </Section>

        <Section title="How we use information">
          We use information to operate the marketplace, authenticate users, process email purchase
          requests, communicate about lots and logistics, prevent fraud and abuse, improve
          reliability, and comply with law.
        </Section>

        <Section title="Sharing">
          We share information with service providers that host the Platform (including database,
          authentication, and email infrastructure), with sellers or buyers as needed to complete a
          transaction you initiate, and when required by law or to protect rights and safety. We do
          not sell personal information.
        </Section>

        <Section title="Retention and security">
          We retain account and transaction records for as long as needed to operate the marketplace,
          resolve disputes, and meet legal obligations. We apply administrative and technical
          safeguards appropriate to a cloud-hosted marketplace; no method of transmission is
          perfectly secure.
        </Section>

        <Section title="Your choices">
          You may update account email through supported account flows, request access or deletion
          subject to legal retention needs, and opt out of non-essential marketing messages. Transactional
          notices related to orders and security may still be sent.
        </Section>

        <Section title="Contact">
          Privacy requests:{" "}
          <a href="mailto:privacy@astock.market" className="font-semibold text-accent-deep hover:underline">
            privacy@astock.market
          </a>
          . Related terms:{" "}
          <Link href="/terms" className="font-semibold text-accent-deep hover:underline">
            Terms &amp; Conditions
          </Link>
          .
        </Section>

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-steel">
          This policy is a working template for Astock and should be reviewed by counsel for your
          operating jurisdictions.
        </p>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">{children}</p>
    </section>
  );
}
