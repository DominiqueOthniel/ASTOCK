import { redirect } from "next/navigation";

export default async function AccountOrdersAlias({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, value);
  });
  redirect(`/account${qs.toString() ? `?${qs.toString()}` : ""}`);
}
