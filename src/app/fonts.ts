import { Be_Vietnam_Pro, Unbounded } from "next/font/google";

// Cả hai font đều có bộ ký tự tiếng Việt
export const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "800"],
});

export const display = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "vietnamese"],
});
