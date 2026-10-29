"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef } from "react";
import { easeLuxe } from "@/lib/motion";

/**
 * Khung một ảnh trong album, ba lớp chuyển động khi cuộn:
 * 1. Vào màn hình: khung mở dần từ dưới lên (clip-path), ảnh lắng từ 1.2 về 1.
 * 2. Trong lúc cuộn: ảnh trôi chậm hơn khung (parallax ±6%), như nhìn qua ô cửa.
 * Lớp ảnh cao hơn khung 16% để lúc trôi không lộ mép. Giảm chuyển động thì đứng yên.
 */
export function GalleryReveal({
  ratio,
  order,
  children,
}: {
  /** Tỉ lệ khung "rộng / cao", giữ chỗ để layout không nhảy */
  ratio: string;
  /** 0, 1, 2: lệch nhịp mở để nhiều ảnh cùng lọt vào màn hình không bật ra đồng loạt */
  order: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const shown = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const open = shown || !!still;
  const transition = { ease: easeLuxe, delay: order * 0.12 };

  return (
    <motion.div
      ref={ref}
      className="relative mb-5 w-full break-inside-avoid overflow-hidden sm:mb-8"
      style={{ aspectRatio: ratio }}
      initial={false}
      animate={{ clipPath: open ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
      transition={{ duration: 1.4, ...transition }}
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[8%]"
        style={{ y: still ? 0 : drift }}
      >
        <motion.div
          className="size-full"
          initial={false}
          animate={{ scale: open ? 1 : 1.2 }}
          transition={{ duration: 1.8, ...transition }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
