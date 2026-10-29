import type { CSSProperties } from "react";

/**
 * Bảng màu "Sơn Mài & Ngà" — nguồn duy nhất cho CSS (qua biến --<tên>), 3D và SVG.
 * Nền ngà như giấy thiệp; sơn then (đen sơn mài) cho Hero, phong bì, đếm ngược, footer;
 * vàng lá chỉ dùng làm nét mảnh và chữ nhỏ; đỏ son là điểm nhấn duy nhất (5–10% trang).
 * Thêm màu mới ở đây rồi khai báo thêm trong @theme của globals.css để có class Tailwind.
 */
export const palette = {
  // Nền chính, giấy ngà
  ivory: "#faf6ee",
  // Nền phụ, giấy dó / vỏ trứng sơn mài
  paper: "#efe6d2",
  // Sơn then: đen sơn mài
  lacquer: "#14100d",
  // Nâu cánh gián, lớp dưới của sơn mài
  umber: "#3b2416",
  // Vàng lá: nét mảnh, chữ nhỏ trên nền tối
  gold: "#c9a24a",
  // Vàng lá đậm: chữ vàng trên nền ngà (đủ tương phản)
  goldDeep: "#8a6a2b",
  // Đỏ son: điểm nhấn duy nhất (nút chính, dấu sáp, sợi chỉ, tráp)
  son: "#9e1b1b",
  // Chữ mực
  ink: "#2a2522",
} as const;

export type PaletteColor = keyof typeof palette;

/** Gắn lên <html> để CSS và Tailwind đọc được bảng màu */
export const paletteVars = Object.fromEntries(
  Object.entries(palette).map(([name, hex]) => [`--${name}`, hex]),
) as CSSProperties;
