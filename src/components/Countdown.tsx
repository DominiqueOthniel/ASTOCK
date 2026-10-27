"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/lots";

export function Countdown({ endsAt, className = "" }: { endsAt: string; className?: string }) {
  const [label, setLabel] = useState("…");

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(endsAt, Date.now()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return <span className={className}>{label}</span>;
}
