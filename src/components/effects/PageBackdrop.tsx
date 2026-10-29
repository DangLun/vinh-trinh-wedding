"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { palette } from "@/config/theme";

// Trời đổi theo trang: sáng sớm gió bấc xanh lạnh → nắng mai vàng → hồng ấm Valentine
const sky = `linear-gradient(180deg, ${palette.ice} 0%, ${palette.milk} 30%, ${palette.cream} 55%, ${palette.milk} 75%, ${palette.blush} 100%)`;

// Các mảng loang đặt lệch ra hai lề để không làm nhạt phần chữ ở giữa
const blobs = [
  `radial-gradient(28% 18% at 4% 8%, ${palette.mist} 0%, transparent 70%)`,
  `radial-gradient(26% 18% at 97% 22%, ${palette.sky}66 0%, transparent 70%)`,
  `radial-gradient(30% 20% at 2% 46%, ${palette.butter}55 0%, transparent 70%)`,
  `radial-gradient(26% 18% at 98% 62%, ${palette.cream} 0%, transparent 70%)`,
  `radial-gradient(30% 20% at 5% 84%, ${palette.bubblegum}33 0%, transparent 70%)`,
  `radial-gradient(26% 16% at 95% 96%, ${palette.lixi}22 0%, transparent 70%)`,
].join(", ");

/** Nền cố định sau toàn trang, trôi chậm lên trên khi cuộn nên màu trời đổi dần theo nội dung. */
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
        style={{ background: `${blobs}, ${sky}`, y: still ? 0 : y }}
      />
    </div>
  );
}
