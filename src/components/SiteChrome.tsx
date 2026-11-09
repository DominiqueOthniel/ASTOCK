"use client";

import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SupportChatProvider } from "@/components/SupportChat";

export function SiteChrome({
  email,
  cartCount,
  children,
}: {
  email: string | null;
  cartCount: number;
  children: ReactNode;
}) {
  return (
    <SupportChatProvider>
      <SiteHeader email={email} cartCount={cartCount} />
      {children}
    </SupportChatProvider>
  );
}
