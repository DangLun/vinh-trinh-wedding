import type { ReactNode } from "react";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";

const initials = [wedding.groom.name[0], wedding.bride.name[0]] as const;

/**
 * Chữ lồng V & T trong hai vòng tròn vàng lá: dấu sáp phong bì, cuối "Chuyện tình mình", footer.
 * Vẽ trong khung 120×120; `ring` là phần tử thay cho vòng ngoài (vd. motion.circle để vẽ dần theo cuộn).
 */
export function Monogram({
  color = palette.gold,
  ring,
  className,
}: {
  color?: string;
  ring?: ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden>
      {ring ?? <circle cx={60} cy={60} r={57} stroke={color} strokeWidth={1} />}
      <circle cx={60} cy={60} r={51} stroke={color} strokeWidth={0.5} />
      <text
        x={60}
        y={73}
        textAnchor="middle"
        fill={color}
        style={{ fontFamily: "var(--font-imperial)" }}
        fontSize={44}
      >
        {initials[0]}
        {/* "&" bằng Cormorant nghiêng như ở tên cặp đôi (CoupleName) */}
        <tspan
          dx={3}
          dy={-4}
          fontSize={22}
          fontWeight={300}
          style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
        >
          &amp;
        </tspan>
        <tspan dx={3} dy={4}>
          {initials[1]}
        </tspan>
      </text>
    </svg>
  );
}
