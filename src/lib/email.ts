export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

/**
 * Transactional email via Resend when RESEND_API_KEY is set.
 * Otherwise logs a structured queue entry (no-op send).
 */
export async function sendTransactionalEmail(payload: EmailPayload) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Astock <noreply@astock.market>";

  if (!key) {
    console.info(
      JSON.stringify({
        type: "email_queued",
        provider: "none",
        ...payload,
      }),
    );
    return { ok: true as const, queued: true as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("email_send_failed", response.status, body.slice(0, 400));
    return { ok: false as const, queued: false as const };
  }

  return { ok: true as const, queued: false as const };
}

export async function notifyBidPlaced(opts: {
  email: string;
  lotTitle: string;
  amount: number;
  slug: string;
}) {
  return sendTransactionalEmail({
    to: opts.email,
    subject: `Bid placed on ${opts.lotTitle}`,
    text: `Your bid of $${opts.amount.toLocaleString()} on "${opts.lotTitle}" was recorded.\n\nView lot: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://astock-one.vercel.app"}/lots/${opts.slug}`,
  });
}

export async function notifyOutbid(opts: {
  email: string;
  lotTitle: string;
  amount: number;
  slug: string;
}) {
  return sendTransactionalEmail({
    to: opts.email,
    subject: `Outbid on ${opts.lotTitle}`,
    text: `Someone placed a higher bid on "${opts.lotTitle}". The current bid is $${opts.amount.toLocaleString()}.\n\nBid again: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://astock-one.vercel.app"}/lots/${opts.slug}`,
  });
}

export async function notifySold(opts: {
  email: string;
  lotTitle: string;
  amount: number;
  slug: string;
}) {
  return sendTransactionalEmail({
    to: opts.email,
    subject: `Purchase confirmed: ${opts.lotTitle}`,
    text: `Your purchase of "${opts.lotTitle}" for $${opts.amount.toLocaleString()} is confirmed.\n\nLot: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://astock-one.vercel.app"}/lots/${opts.slug}`,
  });
}

export async function notifySellInquiry(opts: {
  email: string;
  company: string;
}) {
  return sendTransactionalEmail({
    to: opts.email,
    subject: "Astock received your seller inquiry",
    text: `Thanks ${opts.company}. We received your seller inquiry and will follow up about manifests, grades, and pickup.`,
  });
}
