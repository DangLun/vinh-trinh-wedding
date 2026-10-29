import type { CSSProperties } from "react";

/**
 * Bảng màu "Xuân miền Tây × Valentine" (nền Pastel Y2K) — nguồn duy nhất cho CSS (qua biến --<tên>), 3D, confetti và SVG.
 * Ba lớp không khí: sáng sớm gió bấc se lạnh (sky, ice, mist, lilac), nắng Tết hoa mai (butter, cream),
 * ngọt ngào Valentine (bubblegum, blush, lixi, plum). Tên màu giữ nguyên để không phải sửa nơi dùng.
 * Thêm màu mới ở đây rồi khai báo thêm trong @theme của globals.css để có class Tailwind.
 */
export const palette = {
  // Nền giấy ngà ấm
  milk: "#fff8f1",
  // Hồng hoa hồng Valentine
  bubblegum: "#ff6b98",
  // Tím sương sớm
  lilac: "#b3a3f5",
  // Xanh trời gió bấc
  sky: "#9fd8f2",
  // Vàng hoa mai
  butter: "#ffd447",
  // Đỏ rượu vang, màu chữ chính
  plum: "#4a1530",
  // Đỏ lì xì, chỉ dùng làm điểm nhấn
  lixi: "#d92b43",
  // Tông nhạt, dùng cho nền gradient
  blush: "#ffd5de",
  mist: "#e2dcfb",
  ice: "#d8eff9",
  cream: "#fff0bd",
} as const;

/**
 * Màu kim loại thật cho nhẫn 3D (phản xạ gốc F0 của vàng hồng và vàng 18K).
 * Không đưa vào CSS: kim loại chỉ "ra kim loại" khi có môi trường phản chiếu.
 */
export const metals = {
  roseGold: "#f2b8a2",
  gold: "#ffcf6b",
} as const;

/** Màu nhân vật minh hoạ (đội bưng quả ở Countdown): áo dài nam xanh, nữ đỏ */
export const figure = {
  skin: "#ffdcc4",
  maleAoDai: "#4f86e8",
  maleTrim: "#2f5fb8",
  femaleAoDai: "#d92b43",
  femaleTrim: "#a81d33",
  // Cô dâu chú rể (cuối "Chuyện tình mình")
  suit: "#2c3a63",
  suitTrim: "#1c2645",
  dress: "#ffffff",
  dressShade: "#f1e6f5",
} as const;

export type PaletteColor = keyof typeof palette;

/** Gắn lên <html> để CSS và Tailwind đọc được bảng màu */
export const paletteVars = Object.fromEntries(
  Object.entries(palette).map(([name, hex]) => [`--${name}`, hex]),
) as CSSProperties;
