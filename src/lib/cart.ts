import { cookies } from "next/headers";

export const CART_COOKIE = "astock_cart";

export type CartItem = {
  slug: string;
};

function parseCart(raw: string | undefined): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const slugs = parsed
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object" && "slug" in item) {
          return String((item as { slug: unknown }).slug ?? "").trim();
        }
        return "";
      })
      .filter(Boolean);
    return [...new Set(slugs)].map((slug) => ({ slug }));
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
  const unique = [...new Set(items.map((item) => item.slug).filter(Boolean))].map(
    (slug) => ({ slug }),
  );
  store.set(CART_COOKIE, JSON.stringify(unique), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 60 * 60 * 24 * 14,
  });
  return unique;
}

export async function addToCart(slug: string) {
  const current = await readCart();
  if (current.some((item) => item.slug === slug)) return current;
  return writeCart([...current, { slug }]);
}

export async function removeFromCart(slug: string) {
  const current = await readCart();
  return writeCart(current.filter((item) => item.slug !== slug));
}

export async function clearCart() {
  return writeCart([]);
}
