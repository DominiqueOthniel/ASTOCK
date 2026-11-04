import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-3xl font-bold text-ink">Astock</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-steel">
          Back office access for marketplace operators. Use the production admin credentials from your environment.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
