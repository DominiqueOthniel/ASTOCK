import type { Metadata } from "next";
import Link from "next/link";
import { SupportChatButton } from "@/components/SupportChatButton";

export const metadata: Metadata = {
  title: "Support",
  description: "Order help, FAQ, and contact for PalletDeals.",
};

const faqs = [
  {
    q: "How do orders work?",
    a: "Browse lots, add what you need to cart, then request an order while signed in. We review availability and email next steps. Your card is not charged until the order is confirmed.",
  },
  {
    q: "What is the $150 minimum?",
    a: "Cart and buy-now need a total of $150 or more. Mix singles and lots if one item is under that amount. The cart shows how much is left to unlock checkout.",
  },
  {
    q: "Can I buy single units?",
    a: "Yes for SKUs sold by the unit, including Christmas trees and the PlayStation 5 Slim. Bulk pallets still sell as whole lots.",
  },
  {
    q: "Shipping and pickup?",
    a: "Each lot lists shipping. Many singles ship free by parcel. Larger pallets may need an LTL quote after you order.",
  },
  {
    q: "Returns?",
    a: "Orders are confirmed case by case after we check the lot. Reach out before requesting if you have a question about grade or condition notes.",
  },
];

export default function SupportPage() {
  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Help</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">Support</h1>
        <p className="mt-3 text-steel">
          Straight answers on ordering, minimums, and how to reach us.
        </p>

        <section className="mt-8" data-testid="support-choose">
          <h2 className="font-display text-xl font-semibold text-ink">How do you want to reach us?</h2>
          <p className="mt-1 text-sm text-steel">Pick email or chat. WhatsApp is also available.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:uncledrewlegacy@gmail.com"
              className="border border-line bg-surface p-5 shadow-[var(--shadow)] transition hover:border-accent"
              data-testid="support-email"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Email</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">Write us</p>
              <p className="mt-2 text-sm text-ink-soft">uncledrewlegacy@gmail.com</p>
              <p className="mt-4 text-sm font-semibold text-accent-deep">Open mail →</p>
            </a>
            <div className="border border-line bg-surface p-5 shadow-[var(--shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Chat</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">Ask in chat</p>
              <p className="mt-2 text-sm text-ink-soft">
                Quick FAQ answers, then WhatsApp or email if you need a person.
              </p>
              <SupportChatButton className="btn btn-primary mt-4 !min-h-10 text-sm" />
            </div>
          </div>
          <p className="mt-4 text-sm text-steel">
            WhatsApp:{" "}
            <a
              href="https://wa.me/12404009904"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent-deep hover:underline"
            >
              +1 (240) 400-9904
            </a>
          </p>
        </section>

        <section className="mt-12 space-y-0 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-steel transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </section>

        <p className="mt-10 text-sm text-steel">
          Prefer browsing?{" "}
          <Link href="/browse" className="font-semibold text-accent-deep hover:underline">
            See open lots
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
