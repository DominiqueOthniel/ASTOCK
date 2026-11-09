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
    a: "Yes for SKUs sold by the unit, including Christmas trees and the PlayStation 5. Bulk pallets still sell as whole lots.",
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

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="mailto:uncledrewlegacy@gmail.com" className="btn btn-primary">
            Email support
          </a>
          <a
            href="https://wa.me/12404009904"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            WhatsApp +1 (240) 400-9904
          </a>
          <SupportChatButton className="btn btn-secondary" />
        </div>

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

        <section className="mt-12 border border-line bg-surface p-5 shadow-[var(--shadow)]">
          <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              Email:{" "}
              <a
                href="mailto:uncledrewlegacy@gmail.com"
                className="font-medium text-accent-deep hover:underline"
              >
                uncledrewlegacy@gmail.com
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a
                href="https://wa.me/12404009904"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent-deep hover:underline"
              >
                +1 (240) 400-9904
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/palletplugdeals"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent-deep hover:underline"
              >
                @palletplugdeals
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-steel">
            Prefer browsing?{" "}
            <Link href="/browse" className="font-semibold text-accent-deep hover:underline">
              See open lots
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
