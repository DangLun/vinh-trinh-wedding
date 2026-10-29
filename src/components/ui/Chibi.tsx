import { figure, palette } from "@/config/theme";

/**
 * Phần dùng chung cho nhân vật chibi (đội bưng quả, cô dâu chú rể).
 * Mọi nhân vật vẽ trong khung 100×172, đầu tròn tâm (50,31) bán kính 16.
 */
export const CHIBI_VIEWBOX = "0 0 100 172";

export const OUTLINE = {
  stroke: palette.plum,
  strokeWidth: 1.8,
  strokeLinejoin: "round",
} as const;

/**
 * Mặt tròn: da, mắt, má hồng, miệng cười. Tóc / mũ vẽ chồng lên sau.
 * `sparkle`: thêm đốm sáng trong mắt cho nét trẻ trung (dùng cho cô dâu chú rể).
 */
export function Face({ sparkle = false }: { sparkle?: boolean }) {
  return (
    <g>
      <circle cx={50} cy={31} r={16} fill={figure.skin} {...OUTLINE} />
      <ellipse cx={44} cy={32} rx={1.6} ry={2.2} fill={palette.plum} />
      <ellipse cx={56} cy={32} rx={1.6} ry={2.2} fill={palette.plum} />
      {sparkle && (
        <>
          <circle cx={44.6} cy={31.1} r={0.7} fill="#fff" />
          <circle cx={56.6} cy={31.1} r={0.7} fill="#fff" />
        </>
      )}
      <circle cx={40} cy={37} r={3} fill={palette.bubblegum} opacity={0.5} />
      <circle cx={60} cy={37} r={3} fill={palette.bubblegum} opacity={0.5} />
      <path
        d="M46 38 Q50 41.5 54 38"
        fill="none"
        stroke={palette.plum}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Tay áo từ vai tới bàn tay: viền mận + màu áo chồng lên, kèm bàn tay tròn */
export function Arm({
  from,
  to,
  color,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
}) {
  const line = { x1: from[0], y1: from[1], x2: to[0], y2: to[1] };
  return (
    <g strokeLinecap="round">
      <line {...line} stroke={palette.plum} strokeWidth={11} />
      <line {...line} stroke={color} strokeWidth={7.5} />
      <circle cx={to[0]} cy={to[1]} r={4.6} fill={figure.skin} {...OUTLINE} />
    </g>
  );
}
