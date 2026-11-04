import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/lots", label: "Lots" },
  { href: "/admin/lots/new", label: "New lot" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#eef3f6_0%,#f4f7f9_40%,#f4f7f9_100%)]">
      <header className="border-b border-line bg-ink text-white">
        <div className="mx-auto flex w-[min(1100px,calc(100%-2rem))] flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="font-display text-lg font-bold tracking-tight">Astock Admin</p>
            <p className="text-xs text-white/55">{email}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-white/80 hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/" className="text-white/55 hover:text-white">
              View site
            </Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="btn btn-ghost !min-h-9 !px-3 text-sm">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-[min(1100px,calc(100%-2rem))] py-10">{children}</main>
    </div>
  );
}
