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
  const from = process.env.EMAIL_FROM ?? "PalletDeals <noreply@palletdealsshop.com>";

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
    subject: "PalletDeals received your seller inquiry",
    text: `Thanks ${opts.company}. We received your seller inquiry and will follow up about manifests, grades, and pickup.`,
  });
}

export async function notifyOrderRequest(opts: {
  opsEmail: string;
  buyerEmail: string;
  lotTitle: string;
  slug: string;
  amount: number;
  quantity?: number;
  orderId: string;
  buyerBlock?: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astock-one.vercel.app";
  const ops = await sendTransactionalEmail({
    to: opts.opsEmail,
    subject: `Order request: ${opts.lotTitle}`,
    text: [
      `New PalletDeals purchase request.`,
      ``,
      `Order ID: ${opts.orderId}`,
      `Lot: ${opts.lotTitle}`,
      `Slug: ${opts.slug}`,
      `Quantity: ${opts.quantity ?? 1}`,
      `Amount: $${opts.amount.toLocaleString()}`,
      `Account email: ${opts.buyerEmail}`,
      opts.buyerBlock ? `` : null,
      opts.buyerBlock ?? null,
      ``,
      `Lot URL: ${site}/lots/${opts.slug}`,
      ``,
      `Confirm with the buyer by email or phone to complete the sale.`,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  await sendTransactionalEmail({
    to: opts.buyerEmail,
    subject: `We received your order request: ${opts.lotTitle}`,
    text: [
      `Thanks for your interest in "${opts.lotTitle}".`,
      ``,
      `We recorded your request for $${opts.amount.toLocaleString()} (order ${opts.orderId}).`,
      `A PalletDeals operator will confirm next steps by email.`,
      ``,
      `Lot: ${site}/lots/${opts.slug}`,
    ].join("\n"),
  });

  return ops;
}
