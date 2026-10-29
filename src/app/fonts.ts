import { Agbalumo, Be_Vietnam_Pro, Fraunces } from "next/font/google";

// Cả ba font đều có bộ ký tự tiếng Việt

/** Nội dung */
export const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "800"],
});

/** Tên, tiêu đề: béo, bo tròn, retro Y2K. Chỉ có một độ đậm (400). */
export const display = Agbalumo({
  variable: "--font-agbalumo",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

/** Số (giờ, ngày, đếm ngược): serif mềm, dễ đọc. Trục SOFT/WONK bật trong globals.css */
export const numeric = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  axes: ["SOFT", "WONK", "opsz"],
});
