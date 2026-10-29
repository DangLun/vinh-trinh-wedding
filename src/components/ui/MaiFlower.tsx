import { palette } from "@/config/theme";

/** Một cánh mai trong khung 24×24, gốc cánh ở tâm (12,12) */
export const MAI_PETAL = "M12 12 C9 9 9 3 12 1.5 C15 3 15 9 12 12 Z";

/** Hoa mai 5 cánh, nhuỵ đỏ: nhóm <g> vẽ trong khung 24×24, đặt vào <svg viewBox="0 0 24 24"> */
export function MaiFlower() {
  return (
    <g>
      {Array.from({ length: 5 }, (_, k) => (
        <path
          key={k}
          d={MAI_PETAL}
          fill={palette.butter}
          stroke="#f2b100"
          strokeWidth={0.6}
          transform={`rotate(${k * 72} 12 12)`}
        />
      ))}
      <circle cx={12} cy={12} r={2.2} fill={palette.lixi} />
    </g>
  );
}
