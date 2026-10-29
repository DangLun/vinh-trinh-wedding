import type { ReactNode } from "react";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";

// Mặt sơn son: sáng ở giữa, sẫm dần ra mép như lớp sơn mài được mài bóng
const SON_FACE = `linear-gradient(180deg, ${palette.son} 0%, #6e1212 100%)`;

/**
 * Tráp sơn son thếp vàng nhìn thẳng (ý của lễ bưng quả), đựng một ô đếm ngược.
 * Khung 100×116: nắp vòm có núm vàng, thân hộp có khung chỉ vàng, chân tráp.
 * Thân là HTML (nền SON_FACE) để chữ số bên trong canh giữa và co theo `cqw`.
 */
export function LacquerBox({ children }: { children: ReactNode }) {
  return (
    <div className="@container relative aspect-[100/116] w-full">
      <svg
        viewBox="0 0 100 116"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.son} />
            <stop offset="1" stopColor="#7a1414" />
          </linearGradient>
        </defs>
        {/* Núm nắp */}
        <circle cx={50} cy={6} r={4} fill={palette.gold} />
        <rect x={47.5} y={9} width={5} height={5} fill={palette.goldDeep} />
        {/* Nắp vòm */}
        <path
          d="M8 30 C8 18 28 13 50 13 C72 13 92 18 92 30 Z"
          fill="url(#lid)"
          stroke={palette.gold}
          strokeWidth={0.6}
        />
        <g transform="translate(44 15.5) scale(0.5)">
          <MaiFlower />
        </g>
        {/* Viền nắp thếp vàng */}
        <rect x={6} y={29} width={88} height={5} fill={palette.gold} />
        <rect x={6} y={33.4} width={88} height={0.6} fill={palette.goldDeep} />
        {/* Chân tráp */}
        <rect x={14} y={106} width={12} height={8} fill={palette.goldDeep} />
        <rect x={74} y={106} width={12} height={8} fill={palette.goldDeep} />
      </svg>

      {/* Thân hộp: khung chỉ vàng lồng bên trong */}
      <div
        className="absolute inset-x-[10%] top-[29.3%] bottom-[8.6%] p-[6%]"
        style={{ background: SON_FACE }}
      >
        <div className="border-gold/70 text-ivory flex size-full flex-col items-center justify-center gap-[3cqw] border">
          {children}
        </div>
      </div>
    </div>
  );
}
