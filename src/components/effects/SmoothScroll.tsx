"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    // lerp mặc định 0.1 làm trang trôi trễ sau tay cuộn (trackpad Mac thấy rõ, cảm giác như lag);
    // 0.18 vẫn mượt nhưng bám tay hơn
    const lenis = new Lenis({ lerp: 0.18 });
    setLenis(lenis);
    let id = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
  return null;
}
