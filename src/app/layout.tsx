import type { Metadata } from "next";
import SmoothScroll from "@/components/effects/SmoothScroll";
import { paletteVars } from "@/config/theme";
import { coupleName, wedding } from "@/config/wedding";
import { display, sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${coupleName} | Save the date`,
  description: `Trân trọng kính mời bạn đến chung vui cùng ${coupleName} ${wedding.hashtag}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${sans.variable} ${display.variable} antialiased`}
      style={paletteVars}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
