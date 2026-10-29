import { metals } from "@/config/theme";
import { cn } from "@/lib/cn";

/** Bản SVG tĩnh của cặp nhẫn: hiện khi đang tải 3D, máy yếu hoặc bật giảm chuyển động. */
export function StaticRings({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("h-auto w-[min(80vw,520px)]", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="ring-a"
          gradientUnits="userSpaceOnUse"
          x1="40"
          y1="20"
          x2="200"
          y2="180"
        >
          {/* Sáng – tối – sáng xen kẽ để giả vệt phản chiếu kim loại */}
          <stop offset="0" stopColor="#fff1ea" />
          <stop offset="0.35" stopColor={metals.roseGold} />
          <stop offset="0.6" stopColor="#9c5d4c" />
          <stop offset="1" stopColor={metals.roseGold} />
        </linearGradient>
        <linearGradient
          id="ring-b"
          gradientUnits="userSpaceOnUse"
          x1="280"
          y1="20"
          x2="120"
          y2="180"
        >
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.35" stopColor={metals.gold} />
          <stop offset="0.6" stopColor="#9a6a12" />
          <stop offset="1" stopColor={metals.gold} />
        </linearGradient>
      </defs>
      <circle
        cx="120"
        cy="100"
        r="70"
        fill="none"
        stroke="url(#ring-a)"
        strokeWidth="16"
      />
      <circle
        cx="200"
        cy="100"
        r="70"
        fill="none"
        stroke="url(#ring-b)"
        strokeWidth="16"
      />
      {/* Vẽ lại đoạn nhẫn hồng phía trên để nó đè lên nhẫn tím, tạo cảm giác lồng nhau */}
      <path
        d="M 160 42.6 A 70 70 0 0 1 190 100"
        fill="none"
        stroke="url(#ring-a)"
        strokeWidth="16"
      />
    </svg>
  );
}
