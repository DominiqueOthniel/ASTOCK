import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/lots", label: "Lots" },
  { href: "/admin/lots/new", label: "New lot" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Contacts" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full overflow-x-clip bg-[linear-gradient(180deg,#eef3f6_0%,#f4f7f9_40%,#f4f7f9_100%)]">
      <header className="border-b border-line bg-ink text-white">
        <div className="admin-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold tracking-tight">Astock Admin</p>
            <p className="truncate text-xs text-white/55">{email}</p>
          </div>
          <nav className="scroll-x flex max-w-full items-center gap-1 pb-1 sm:gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 shrink-0 items-center px-3 text-sm text-white/80 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="inline-flex min-h-10 shrink-0 items-center px-3 text-sm text-white/55 hover:text-white"
            >
              View site
            </Link>
            <form action="/api/admin/logout" method="post" className="shrink-0">
              <button type="submit" className="btn btn-ghost !min-h-10 !px-3 text-sm">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="admin-shell py-8 sm:py-10">{children}</main>
    </div>
  );
}
