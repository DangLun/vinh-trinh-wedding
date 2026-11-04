import type { ReactNode } from "react";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";

// Mặt tráp màu kem, sẫm nhẹ xuống đáy: nổi trên nền đỏ rượu của phần đếm ngược
const SHADE = "#e6dccb";
const FACE = `linear-gradient(180deg, ${palette.ivory} 0%, ${SHADE} 100%)`;

/**
 * Tráp kem thếp vàng nhìn thẳng (ý của lễ bưng quả), đựng một ô đếm ngược.
 * Khung 100×116: nắp vòm có núm vàng, thân hộp có khung chỉ vàng, chân tráp.
 * Thân là HTML (nền FACE) để chữ số bên trong canh giữa và co theo `cqw`.
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
            <stop offset="0" stopColor={palette.ivory} />
            <stop offset="1" stopColor={SHADE} />
          </linearGradient>
        </defs>
        {/* Núm nắp */}
        <circle cx={50} cy={6} r={4} fill={palette.gold} />
        <rect x={47.5} y={9} width={5} height={5} fill={palette.gold} />
        {/* Nắp vòm */}
        <path
          d="M8 30 C8 18 28 13 50 13 C72 13 92 18 92 30 Z"
          fill="url(#lid)"
          stroke={palette.gold}
          strokeWidth={0.6}
        />
        <g transform="translate(44 15.5) scale(0.5)">
          <MaiFlower color={palette.goldDeep} />
        </g>
        {/* Viền nắp thếp vàng */}
        <rect x={6} y={29} width={88} height={5} fill={palette.gold} />
        <rect x={6} y={33.4} width={88} height={0.6} fill={palette.goldDeep} />
        {/* Chân tráp */}
        <rect x={14} y={106} width={12} height={8} fill={palette.gold} />
        <rect x={74} y={106} width={12} height={8} fill={palette.gold} />
      </svg>

      {/* Thân hộp: khung chỉ vàng lồng bên trong */}
      <div
        className="absolute inset-x-[10%] top-[29.3%] bottom-[8.6%] p-[6%]"
        style={{ background: FACE }}
      >
        <div className="border-gold/70 text-wine flex size-full flex-col items-center justify-center gap-[3cqw] border">
          {children}
        </div>
      </div>
    </div>
  );
}
