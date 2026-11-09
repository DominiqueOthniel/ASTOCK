"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do orders work?",
    a: "Add lots to your cart, then request an order. We confirm by email. No card charge until the order is confirmed. Orders need a $150 minimum.",
  },
  {
    q: "What is the order minimum?",
    a: "Checkout needs a total of $150 or more. You can mix singles and lots to get there.",
  },
  {
    q: "Can I buy one Christmas tree or PS5?",
    a: "Yes. Singles like trees and the PS5 sell from 1 unit at the listed per-unit price.",
  },
  {
    q: "How do I reach a person?",
    a: "Email uncledrewlegacy@gmail.com or WhatsApp +1 (240) 400-9904. We usually reply the same business day.",
  },
];

type SupportChatContextValue = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const SupportChatContext = createContext<SupportChatContextValue | null>(null);

const fallbackChat: SupportChatContextValue = {
  open: false,
  openChat: () => undefined,
  closeChat: () => undefined,
  toggleChat: () => undefined,
};

export function useSupportChat() {
  return useContext(SupportChatContext) ?? fallbackChat;
}

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const toggleChat = useCallback(() => setOpen((value) => !value), []);
  const value = useMemo(
    () => ({ open, openChat, closeChat, toggleChat }),
    [open, openChat, closeChat, toggleChat],
  );

  return (
    <SupportChatContext.Provider value={value}>
      {children}
      <SupportChatPanel />
    </SupportChatContext.Provider>
  );
}

function SupportChatPanel() {
  const { open, closeChat } = useSupportChat();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi, I can help with orders, shipping, and contact options. Pick a topic below.",
    },
  ]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeChat();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  function ask(faq: (typeof FAQS)[number]) {
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: faq.q },
      { id: `b-${Date.now()}`, role: "bot", text: faq.a },
    ]);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" data-testid="support-chat">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close chat"
        onClick={closeChat}
      />
      <aside
        className="absolute inset-x-0 bottom-0 flex max-h-[min(88vh,640px)] flex-col border-t border-line bg-paper shadow-[0_-8px_30px_rgb(25_22_20/12%)] sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[min(100%,380px)] sm:border-l sm:border-t-0"
        role="dialog"
        aria-modal="true"
        aria-label="Support chat"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="font-display text-lg font-semibold text-ink">Support</p>
            <p className="text-xs text-steel">Quick answers · real contact when you need it</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink"
            onClick={closeChat}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[92%] rounded-sm px-3 py-2 text-sm leading-relaxed ${
                message.role === "bot"
                  ? "bg-accent-soft/60 text-ink-soft"
                  : "ml-auto bg-ink text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-line px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {FAQS.map((faq) => (
              <button
                key={faq.q}
                type="button"
                className="border border-line bg-surface px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:border-accent"
                onClick={() => ask(faq)}
              >
                {faq.q}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <a
              href="https://wa.me/12404009904"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary flex-1 !min-h-10 text-sm"
            >
              WhatsApp
            </a>
            <a
              href="mailto:uncledrewlegacy@gmail.com"
              className="btn btn-secondary flex-1 !min-h-10 text-sm"
            >
              Email
            </a>
          </div>
          <Link
            href="/support"
            className="block text-center text-xs font-semibold text-accent-deep hover:underline"
            onClick={closeChat}
          >
            Full support page
          </Link>
        </div>
      </aside>
    </div>
  );
}
