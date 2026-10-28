import type { MotionProps } from "motion/react";

/**
 * Bật lên kiểu lò xo theo thứ tự. Dùng cho một chuỗi xuất hiện duy nhất (vd. Hero),
 * bọc ngoài bằng <MotionConfig reducedMotion="user"> để tôn trọng giảm chuyển động.
 */
export const springIn = (order: number, baseDelay = 0.25): MotionProps => ({
  initial: { opacity: 0, y: 48, rotate: -4 },
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: {
    type: "spring",
    stiffness: 120,
    damping: 14,
    delay: baseDelay + order * 0.18,
  },
});
