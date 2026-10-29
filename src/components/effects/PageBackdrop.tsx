"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { palette } from "@/config/theme";

// Các mảng loang đặt lệch ra hai lề để không làm nhạt phần chữ ở giữa
const blobs = [
  `radial-gradient(28% 22% at 4% 12%, ${palette.blush} 0%, transparent 70%)`,
  `radial-gradient(26% 20% at 97% 28%, ${palette.mist} 0%, transparent 70%)`,
  `radial-gradient(30% 22% at 2% 48%, ${palette.ice} 0%, transparent 70%)`,
  `radial-gradient(26% 20% at 98% 66%, ${palette.cream} 0%, transparent 70%)`,
  `radial-gradient(30% 22% at 5% 86%, ${palette.mist} 0%, transparent 70%)`,
  `radial-gradient(26% 18% at 95% 96%, ${palette.blush} 0%, transparent 70%)`,
].join(", ");

/** Nền loang pastel cố định sau toàn trang, trôi chậm lên trên khi cuộn. */
export default function PageBackdrop() {
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Lớp nền cao 160vh, cuộn hết trang thì nó chỉ trôi 60vh → cảm giác ở rất xa
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-60vh"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[160vh]"
        style={{ background: blobs, y: still ? 0 : y }}
      />
    </div>
  );
}
