import type { CSSProperties } from "react";

/**
 * Bảng màu "Đỏ Rượu & Kem" — nguồn duy nhất cho CSS (qua biến --<tên>) và SVG.
 * Nền kem trắng như giấy thiệp; đỏ rượu cho Hero, đếm ngược, footer, màn mở đầu;
 * vàng lá chỉ dùng làm nét mảnh và chữ nhỏ.
 * Tên `lacquer`, `son` giữ từ bản sơn mài cũ: nay là nền đậm và màu nút, đều đỏ rượu.
 * Thêm màu mới ở đây rồi khai báo thêm trong @theme của globals.css để có class Tailwind.
 */
export const palette = {
  // Nền chính, kem trắng
  ivory: "#f5f1ea",
  // Nền phụ: thẻ giấy trên nền kem
  paper: "#ece4d6",
  // Nền đậm: đỏ rượu
  lacquer: "#57001a",
  // Quầng sáng trên nền đậm
  umber: "#6e0c26",
  // Đỏ rượu sẫm: nền sau thiệp mời, để thiệp đỏ bên trong vẫn nổi
  wineDeep: "#2e000b",
  // Nền tối của lớp xem ảnh lớn: ảnh trên nền tối dễ xem hơn trên nền đỏ
  night: "#14100d",
  // Vàng lá: nét mảnh, chữ nhỏ trên nền tối
  gold: "#dcb862",
  // Vàng lá đậm: chữ vàng trên nền ngà (đủ tương phản)
  goldDeep: "#73561f",
  // Điểm nhấn trên nền kem (nút chính, sợi chỉ, thông báo lỗi)
  son: "#57001a",
  // Chữ mực
  ink: "#2a2522",
  // Thiệp mời (theo mẫu thiệp giấy): nền trắng ngà, chữ đỏ rượu, chữ phụ xám ấm
  linen: "#f5f1ea",
  wine: "#57001a",
  stone: "#b7afa6",
} as const;

export type PaletteColor = keyof typeof palette;

/** Gắn lên <html> để CSS và Tailwind đọc được bảng màu */
export const paletteVars = Object.fromEntries(
  Object.entries(palette).map(([name, hex]) => [`--${name}`, hex]),
) as CSSProperties;
