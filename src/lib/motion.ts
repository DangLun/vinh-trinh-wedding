import type { MotionProps } from "motion/react";

/** expo-out: khởi đầu dứt khoát rồi lắng dần, không nảy */
export const easeLuxe = [0.16, 1, 0.3, 1] as const;

/**
 * Hiện dần + trồi nhẹ theo thứ tự. Dùng cho một chuỗi xuất hiện duy nhất (vd. Hero),
 * bọc ngoài bằng <MotionConfig reducedMotion="user"> để tôn trọng giảm chuyển động.
 * `play` false thì giữ nguyên trạng thái ẩn (vd. chờ màn mở đầu mở cửa).
 */
export const riseIn = (
  order: number,
  baseDelay = 0.3,
  play = true,
): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: {
    duration: 1.4,
    ease: easeLuxe,
    delay: baseDelay + order * 0.14,
  },
});
