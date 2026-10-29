import { penStroke } from "@/lib/pen";

// File thường (không "use client") để cả ảnh OG ở server lẫn SignatureNames ở client dùng chung

/**
 * Đường giữa của nét nối hai tên, vẽ một nét liền không nhấc bút: lượn sóng nhẹ, vòng lên
 * thành trái tim, đi xuống mũi tim thì vắt chéo qua đường cũ thành khuyên nhỏ rồi lượn sang tên sau.
 * Khung 120×50, chân đường quanh y=40 (khớp chân chữ).
 */
export const HEART_LINE =
  "M0 39 C12 42 24 43.5 36 41.5 C45 40 53 40.5 61 43 C53 39 46 33 47.5 27 C49 21 58 20.5 61.5 27.5 C64 20.5 74 20.5 76 27 C78 34 69 40 60 44 C56 46 62 47.5 69 44.5 C79 40 93 37.5 105 38.5 C112 39.2 117 39.6 120 39";

// Nét ngòi nhọn như chữ Imperial Script: má phải trái tim (nét đi xuống) đậm, còn lại mảnh như tóc.
// Bản nhỏ (dòng thứ bậc trong thiệp) cần nét tóc dày hơn để không mờ mất.
export const HEART_INK = penStroke(HEART_LINE, { hair: 1.2, thick: 4.4 });
export const HEART_INK_SMALL = penStroke(HEART_LINE, { hair: 1.8, thick: 5.2 });
