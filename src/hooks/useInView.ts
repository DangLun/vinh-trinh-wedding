"use client";

import { useEffect, useRef, useState } from "react";

/** Theo dõi phần tử có đang nằm trong màn hình không (mặc định coi là có). */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options,
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return [ref, inView] as const;
}
