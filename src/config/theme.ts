import type { CSSProperties } from "react";

/**
 * Bảng màu Pastel Y2K — nguồn duy nhất cho cả CSS (qua biến --<tên>), 3D, confetti và SVG.
 * Thêm màu mới ở đây rồi khai báo thêm trong @theme của globals.css để có class Tailwind.
 */
export const palette = {
  milk: "#fff5fb",
  bubblegum: "#ff7eb9",
  lilac: "#b9a2ff",
  sky: "#9fe3ff",
  butter: "#fff09a",
  plum: "#3a1747",
  // Tông nhạt, dùng cho nền gradient
  blush: "#ffd1e8",
  mist: "#dcd0ff",
  ice: "#c9f1ff",
  cream: "#fff6c4",
} as const;

export type PaletteColor = keyof typeof palette;

/** Gắn lên <html> để CSS và Tailwind đọc được bảng màu */
export const paletteVars = Object.fromEntries(
  Object.entries(palette).map(([name, hex]) => [`--${name}`, hex]),
) as CSSProperties;
