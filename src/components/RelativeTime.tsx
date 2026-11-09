"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/format";

export function RelativeTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  const [label, setLabel] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    const tick = () => setLabel(formatRelativeTime(date));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [date]);

  return (
    <time dateTime={date} className={className} title={new Date(date).toLocaleString()}>
      {label}
    </time>
  );
}
