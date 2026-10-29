import type { Metadata } from "next";
import CustomCursor from "@/components/effects/CustomCursor";
import SmoothScroll from "@/components/effects/SmoothScroll";
import { siteUrl } from "@/config/site";
import { paletteVars } from "@/config/theme";
import { coupleName, wedding } from "@/config/wedding";
import { sans, script, serif, signature } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: `${coupleName} | Save the date`,
  description: `Trân trọng kính mời bạn đến chung vui cùng ${coupleName} ${wedding.hashtag}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${sans.variable} ${serif.variable} ${script.variable} ${signature.variable} antialiased`}
      style={paletteVars}
    >
      <body>
        <SmoothScroll />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
