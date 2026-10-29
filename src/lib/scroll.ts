import type Lenis from "lenis";

// Lenis của SmoothScroll (một instance cho cả trang), để nơi khác cuộn bằng cùng nhịp mượt
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Về đầu trang: mượt qua Lenis nếu có; giảm chuyển động thì nhảy thẳng */
export function scrollToTop() {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(0, {
      immediate: still,
      duration: 1.6,
      // easeOutExpo: lao nhanh lúc đầu, hãm êm khi gần tới đỉnh
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  }
}
