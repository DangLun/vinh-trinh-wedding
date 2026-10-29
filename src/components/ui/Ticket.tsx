import type { CSSProperties, ReactNode } from "react";
import { palette } from "@/config/theme";
import { cn } from "@/lib/cn";

const NOTCH = 14; // bán kính khấc khoét hai bên (px)
const STUB = "5.75rem"; // chiều cao cuống vé

// Viền 2px + bóng đổ cứng bám theo đúng hình vé (kể cả khấc), không dùng border
const outline = [
  `drop-shadow(2px 0 0 ${palette.plum})`,
  `drop-shadow(-2px 0 0 ${palette.plum})`,
  `drop-shadow(0 2px 0 ${palette.plum})`,
  `drop-shadow(0 -2px 0 ${palette.plum})`,
  `drop-shadow(5px 5px 0 ${palette.plum})`,
].join(" ");

const notch = (side: "0" | "100%") =>
  `radial-gradient(circle ${NOTCH}px at ${side} calc(100% - ${STUB}), #0000 98%, #000)`;

const shape: CSSProperties = {
  borderRadius: 28,
  mask: `${notch("0")}, ${notch("100%")}`,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/**
 * Tấm vé Y2K: phần thân + cuống tách bằng đường xé nét đứt và hai khấc khoét.
 * `surface` là nền (màu/gradient); `stub` là nội dung cuống vé (thường là nút).
 */
export function Ticket({
  surface,
  stub,
  className,
  children,
}: {
  surface: string;
  stub: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("h-full", className)} style={{ filter: outline }}>
      <div
        className="flex h-full flex-col"
        style={{ ...shape, background: surface }}
      >
        <div className="flex-1 p-6 sm:p-8">{children}</div>
        <div
          className="border-plum/35 mx-6 flex shrink-0 items-center gap-3 border-t-2 border-dashed sm:mx-8"
          style={{ height: STUB }}
        >
          {stub}
        </div>
      </div>
    </div>
  );
}
