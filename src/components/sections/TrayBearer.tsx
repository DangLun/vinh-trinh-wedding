import type { ReactNode } from "react";
import { CHIBI_VIEWBOX, Face, OUTLINE } from "@/components/ui/Chibi";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { figure, palette } from "@/config/theme";
import { cn } from "@/lib/cn";

export type BearerGender = "male" | "female";

// Mâm (HTML) đặt đè lên phần ngực theo % của khung nhân vật
const VIEWBOX = CHIBI_VIEWBOX;
// Vị trí hai bàn tay đỡ hai góc đáy mâm
const HANDS = [
  { cx: 11, cy: 120 },
  { cx: 89, cy: 120 },
];

function Head({ gender }: { gender: BearerGender }) {
  return (
    <g>
      {gender === "female" && (
        // Tóc sau gáy + búi tóc cài hoa mai
        <>
          <ellipse cx={50} cy={31} rx={18.5} ry={19} fill={palette.plum} />
          <circle cx={50} cy={11} r={7.5} fill={palette.plum} />
          <svg x={53} y={4} width={12} height={12} viewBox="0 0 24 24">
            <MaiFlower />
          </svg>
        </>
      )}
      <Face />
      {gender === "male" ? (
        // Khăn đóng: vành khăn quấn xếp nếp
        <g>
          <path
            d="M33 28 C31 12 69 12 67 28 C60 23.5 40 23.5 33 28 Z"
            fill={figure.maleAoDai}
            {...OUTLINE}
          />
          <path
            d="M38 23 L43 15 M46 22 L50 14 M54 22 L58 14.5 M62 23 L65 17"
            stroke={figure.maleTrim}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </g>
      ) : (
        // Tóc mái
        <path
          d="M34 30 C31 14 69 14 66 30 C60 21 42 20 34 30 Z"
          fill={palette.plum}
        />
      )}
    </g>
  );
}

/** Thân áo dài + quần trắng + tay áo vươn về phía mâm (phần tay áo bị mâm che gần hết) */
function Body({ gender }: { gender: BearerGender }) {
  const aoDai = gender === "male" ? figure.maleAoDai : figure.femaleAoDai;
  const trim = gender === "male" ? figure.maleTrim : figure.femaleTrim;
  return (
    <g>
      {/* Quần + chân */}
      <rect
        x={38}
        y={140}
        width={11}
        height={25}
        rx={3}
        fill="#fff"
        {...OUTLINE}
      />
      <rect
        x={51}
        y={140}
        width={11}
        height={25}
        rx={3}
        fill="#fff"
        {...OUTLINE}
      />
      <ellipse cx={43} cy={167} rx={6.5} ry={2.6} fill={palette.plum} />
      <ellipse cx={57} cy={167} rx={6.5} ry={2.6} fill={palette.plum} />
      {/* Tay áo: viền mận + màu áo chồng lên */}
      {HANDS.map(({ cx, cy }, i) => (
        <g key={i} strokeLinecap="round">
          <line
            x1={i ? 66 : 34}
            y1={64}
            x2={cx}
            y2={cy}
            stroke={palette.plum}
            strokeWidth={12}
          />
          <line
            x1={i ? 66 : 34}
            y1={64}
            x2={cx}
            y2={cy}
            stroke={aoDai}
            strokeWidth={8.5}
          />
        </g>
      ))}
      {/* Vạt áo dài: bó eo, xẻ tà hai bên, xoè xuống gối */}
      <path
        d="M32 62 Q50 54 68 62 L65 100 L74 148 Q50 153 26 148 L35 100 Z"
        fill={aoDai}
        {...OUTLINE}
      />
      <path d="M50 104 L50 150" stroke={trim} strokeWidth={1.2} opacity={0.6} />
      {/* Cổ + cổ áo đứng */}
      <rect
        x={45.5}
        y={45}
        width={9}
        height={10}
        fill={figure.skin}
        {...OUTLINE}
      />
      <rect
        x={43.5}
        y={52}
        width={13}
        height={6}
        rx={2}
        fill={aoDai}
        {...OUTLINE}
      />
    </g>
  );
}

/**
 * Người bưng mâm quả (đội bưng quả lễ cưới miền Tây). Nội dung mâm (số đếm ngược) truyền qua children,
 * cỡ chữ trong mâm nên dùng đơn vị cqw vì khung là container.
 * Lớp: thân (SVG) → mâm (HTML) → hai bàn tay (SVG) để tay đỡ đè lên đáy mâm.
 */
export function TrayBearer({
  gender,
  index,
  className,
  children,
}: {
  gender: BearerGender;
  /** Thứ tự trong đội, để nhịp nhún so le */
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "animate-bob @container relative aspect-[100/172] w-full motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${-(index % 2) * 0.7 - index * 0.12}s` }}
    >
      <svg viewBox={VIEWBOX} className="absolute inset-0 size-full" aria-hidden>
        <Body gender={gender} />
        <Head gender={gender} />
      </svg>

      {/* Mâm quả: nắp sơn mài đỏ viền hoa văn vàng, núm vàng trên chóp, số nằm trong ô bầu dục vàng */}
      <div className="absolute inset-x-[3%] top-[31%] bottom-[29%] flex flex-col">
        <div className="border-plum bg-butter absolute -top-[7%] left-1/2 z-10 size-[11%] -translate-x-1/2 rounded-full border-2" />
        <div className="border-plum bg-lixi outline-butter flex flex-1 items-center justify-center rounded-t-[50%_38%] rounded-b-lg border-2 pt-[5%] shadow-[3px_3px_0_var(--plum)] outline-2 -outline-offset-[7px] outline-dashed">
          <div className="border-plum bg-butter flex h-[78%] w-[82%] flex-col items-center justify-center rounded-[50%] border-2">
            {children}
          </div>
        </div>
        <div className="border-plum bg-butter -mx-[4%] -mt-1 h-[10%] rounded-full border-2" />
      </div>

      <svg
        viewBox={VIEWBOX}
        className="pointer-events-none absolute inset-0 size-full"
        aria-hidden
      >
        {HANDS.map((h, i) => (
          <circle key={i} {...h} r={5} fill={figure.skin} {...OUTLINE} />
        ))}
      </svg>
    </div>
  );
}
