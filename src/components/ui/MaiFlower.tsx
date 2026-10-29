import { palette } from "@/config/theme";

/** Một cánh mai trong khung 24×24, gốc cánh ở tâm (12,12) */
export const MAI_PETAL = "M12 12 C9 9 9 3 12 1.5 C15 3 15 9 12 12 Z";

/**
 * Hoa mai 5 cánh, nhóm <g> vẽ trong khung 24×24, đặt vào <svg viewBox="0 0 24 24">.
 * "line": nét vàng lá mảnh như dát trên sơn mài; "fill": cánh vàng đặc (ảnh xem trước OG).
 */
export function MaiFlower({
  tone = "line",
  color = palette.gold,
}: {
  tone?: "line" | "fill";
  color?: string;
}) {
  const line = tone === "line";
  return (
    <g>
      {Array.from({ length: 5 }, (_, k) => (
        <path
          key={k}
          d={MAI_PETAL}
          fill={line ? "none" : color}
          stroke={color}
          strokeWidth={line ? 0.7 : 0.4}
          strokeLinejoin="round"
          vectorEffect={line ? "non-scaling-stroke" : undefined}
          transform={`rotate(${k * 72} 12 12)`}
        />
      ))}
      <circle cx={12} cy={12} r={1.6} fill={palette.son} />
    </g>
  );
}

// Cành mai: thân chính cong từ góc dưới lên, vài nhánh con
const BRANCHES = [
  "M2 156 C40 144 72 124 100 98 C128 72 162 58 236 34",
  "M100 98 C106 72 120 54 142 42",
  "M154 64 C168 76 184 82 208 84",
  "M48 136 C54 120 64 110 78 106",
];

// Hoa trên cành: [x, y, cỡ, góc xoay]
const BLOSSOMS: [number, number, number, number][] = [
  [142, 40, 1.3, 12],
  [208, 84, 1.05, 40],
  [234, 34, 0.9, 64],
  [78, 104, 1.1, 20],
  [122, 76, 0.75, 50],
];

// Nụ: chấm tròn nhỏ dọc cành
const BUDS: [number, number][] = [
  [60, 128],
  [176, 52],
  [190, 80],
  [112, 60],
  [24, 150],
];

/**
 * Cành mai vàng nét mảnh, dùng làm khung trang trí (Hero, footer).
 * Vẽ trong khung 240×160, gốc cành ở góc dưới trái; lật bằng class (-scale-x-100) khi đặt bên phải.
 */
export function MaiBranch({ className }: { className?: string }) {
  return (
    // viewBox nới 16 đơn vị mỗi phía: hoa ở đầu cành (234,34) vươn quá mép 240 sẽ bị cắt
    <svg
      viewBox="-16 -16 272 192"
      overflow="visible"
      fill="none"
      className={className}
      aria-hidden
    >
      {BRANCHES.map((d) => (
        <path
          key={d}
          d={d}
          stroke={palette.gold}
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {BUDS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill={palette.gold} />
      ))}
      {BLOSSOMS.map(([x, y, s, r]) => (
        <g
          key={`${x}-${y}`}
          transform={`translate(${x - 12 * s} ${y - 12 * s}) scale(${s}) rotate(${r} 12 12)`}
        >
          <MaiFlower />
        </g>
      ))}
    </svg>
  );
}
