/** Prefer the public brand domain for links and emails. */
export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "https://palletdealsshop.com";
}
