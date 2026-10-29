"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useState } from "react";
import { easeLuxe } from "@/lib/motion";
import { scrollToTop } from "@/lib/scroll";

/**
 * Nút về đầu trang ở góc phải dưới: viên sơn mài viền chỉ vàng, mũi tên mảnh.
 * Chỉ hiện khi đã lướt qua Hero; vòng chỉ vàng quanh nút chạy theo phần trang đã đọc.
 */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 0.9;
    if (next !== shown) setShown(next);
  });

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {shown && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Về đầu trang"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: easeLuxe }}
            className="group bg-lacquer/85 text-gold focus-visible:outline-gold fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 cursor-pointer place-items-center rounded-full backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-4 sm:right-6 sm:bottom-6 sm:size-14"
          >
            <svg
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden
              className="absolute inset-0 size-full -rotate-90"
            >
              {/* Viền mờ cố định + vòng tiến độ đọc trang */}
              <circle
                cx={24}
                cy={24}
                r={23}
                stroke="currentColor"
                strokeOpacity={0.25}
              />
              <motion.circle
                cx={24}
                cy={24}
                r={23}
                stroke="currentColor"
                strokeWidth={1.2}
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <svg
              viewBox="0 0 16 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="ease-luxe h-4 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5"
            >
              <path d="M8 19V2M2 8l6-6 6 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
