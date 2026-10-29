import {
  Be_Vietnam_Pro,
  Cormorant_Garamond,
  Imperial_Script,
  Waterfall,
} from "next/font/google";

// Mọi font đều có bộ ký tự tiếng Việt

/** Nội dung: nét mảnh, đọc dễ ở cỡ nhỏ */
export const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
});

/** Tên, tiêu đề, chữ số: serif Garamond tương phản cao, có bản nghiêng */
export const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

/**
 * Thư pháp copperplate: tên cô dâu chú rể và chữ lồng. Chỉ dùng từ cỡ ~28px trở lên,
 * nhỏ hơn thì nét lượn và dấu tiếng Việt mảnh tới mức khó đọc.
 */
export const script = Imperial_Script({
  variable: "--font-imperial",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

/**
 * Chữ ký nét đều (như viết bằng bút mực): tên trên thiệp mời, theo mẫu thiệp giấy.
 * Chỉ dùng cỡ lớn, cùng lý do với Imperial Script.
 */
export const signature = Waterfall({
  variable: "--font-waterfall",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});
