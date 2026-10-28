"use client";

import { useEffect, useState } from "react";
import { type TimeLeft, timeUntil } from "@/lib/date";

/** Đếm ngược tới mốc ISO. Trả null ở lần render đầu để khớp HTML từ server. */
export function useCountdown(iso: string) {
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => setLeft(timeUntil(target));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [iso]);

  return left;
}
