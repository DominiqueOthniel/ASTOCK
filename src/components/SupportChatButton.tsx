"use client";

import { useSupportChat } from "@/components/SupportChat";

export function SupportChatButton({
  className,
  children = "Open chat",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openChat } = useSupportChat();
  return (
    <button type="button" className={className} onClick={openChat} data-testid="open-chat">
      {children}
    </button>
  );
}
