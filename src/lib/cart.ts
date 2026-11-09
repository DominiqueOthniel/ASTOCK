import { cookies } from "next/headers";

export const CART_COOKIE = "astock_cart";

export type CartItem = {
  slug: string;
  quantity: number;
};

function parseCart(raw: string | undefined): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const bySlug = new Map<string, number>();
    for (const item of parsed) {
      if (typeof item === "string") {
        const slug = item.trim();
        if (slug) bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1);
        continue;
      }
      if (item && typeof item === "object" && "slug" in item) {
        const slug = String((item as { slug: unknown }).slug ?? "").trim();
        if (!slug) continue;
        const qtyRaw = (item as { quantity?: unknown }).quantity;
        const qty =
          typeof qtyRaw === "number" && Number.isFinite(qtyRaw)
            ? Math.max(1, Math.floor(qtyRaw))
            : 1;
        bySlug.set(slug, (bySlug.get(slug) ?? 0) + qty);
      }
    }
    return [...bySlug.entries()].map(([slug, quantity]) => ({ slug, quantity }));
  } catch {
    return [];
  }
}

export async function readCart(): Promise<CartItem[]> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

export async function writeCart(items: CartItem[]) {
  const store = await cookies();
  const bySlug = new Map<string, number>();
  for (const item of items) {
    const slug = item.slug.trim();
    if (!slug) continue;
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + qty);
  }
  const unique = [...bySlug.entries()].map(([slug, quantity]) => ({ slug, quantity }));
  store.set(CART_COOKIE, JSON.stringify(unique), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 60 * 60 * 24 * 14,
  });
  return unique;
}

export async function addToCart(slug: string, quantity = 1) {
  const current = await readCart();
  const existing = current.find((item) => item.slug === slug);
  if (existing) {
    return writeCart(
      current.map((item) =>
        item.slug === slug
          ? { ...item, quantity: item.quantity + Math.max(1, Math.floor(quantity)) }
          : item,
      ),
    );
  }
  return writeCart([...current, { slug, quantity: Math.max(1, Math.floor(quantity)) }]);
}

export async function setCartQuantity(slug: string, quantity: number) {
  const current = await readCart();
  if (quantity <= 0) {
    return writeCart(current.filter((item) => item.slug !== slug));
  }
  if (!current.some((item) => item.slug === slug)) {
    return writeCart([...current, { slug, quantity: Math.max(1, Math.floor(quantity)) }]);
  }
  return writeCart(
    current.map((item) =>
      item.slug === slug ? { ...item, quantity: Math.max(1, Math.floor(quantity)) } : item,
    ),
  );
}

export async function removeFromCart(slug: string) {
  const current = await readCart();
  return writeCart(current.filter((item) => item.slug !== slug));
}

export async function clearCart() {
  return writeCart([]);
}
