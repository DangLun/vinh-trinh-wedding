"use client";

import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Arm, CHIBI_VIEWBOX, Face, OUTLINE } from "@/components/ui/Chibi";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { figure, palette } from "@/config/theme";
import { heartBurst } from "@/lib/confetti";

/** Chú rể vest xanh than, nơ đỏ, hoa mai cài ngực; tay phải chìa sang cô dâu (88,100) */
export function Groom({ className }: { className?: string }) {
  return (
    <svg viewBox={CHIBI_VIEWBOX} className={className} aria-hidden>
      {/* Quần + giày */}
      <rect
        x={39}
        y={114}
        width={10}
        height={48}
        rx={3}
        fill={figure.suit}
        {...OUTLINE}
      />
      <rect
        x={51}
        y={114}
        width={10}
        height={48}
        rx={3}
        fill={figure.suit}
        {...OUTLINE}
      />
      <ellipse cx={43} cy={164} rx={7} ry={3} fill={palette.plum} />
      <ellipse cx={57} cy={164} rx={7} ry={3} fill={palette.plum} />
      <Arm from={[34, 66]} to={[27, 110]} color={figure.suit} />
      <Arm from={[66, 66]} to={[88, 100]} color={figure.suit} />
      {/* Áo vest, sơ mi trắng cổ chữ V, ve áo, cúc */}
      <path
        d="M31 62 Q50 55 69 62 L68 118 L32 118 Z"
        fill={figure.suit}
        {...OUTLINE}
      />
      <path d="M43 58 L57 58 L50 88 Z" fill="#fff" {...OUTLINE} />
      <path d="M43 58 L50 88 L39 74 Z" fill={figure.suitTrim} {...OUTLINE} />
      <path d="M57 58 L50 88 L61 74 Z" fill={figure.suitTrim} {...OUTLINE} />
      <circle cx={50} cy={97} r={1.6} fill={palette.plum} />
      <circle cx={50} cy={107} r={1.6} fill={palette.plum} />
      {/* Cổ + nơ đỏ */}
      <rect
        x={45.5}
        y={45}
        width={9}
        height={11}
        fill={figure.skin}
        {...OUTLINE}
      />
      <path
        d="M43 57 L50 60.5 L43 64 Z M57 57 L50 60.5 L57 64 Z"
        fill={palette.lixi}
        {...OUTLINE}
        strokeWidth={1.2}
      />
      <circle
        cx={50}
        cy={60.5}
        r={1.8}
        fill={palette.lixi}
        {...OUTLINE}
        strokeWidth={1.2}
      />
      <svg x={56} y={64} width={11} height={11} viewBox="0 0 24 24">
        <MaiFlower />
      </svg>
      <Face sparkle />
      {/* Tóc kiểu trẻ: phồng trên đỉnh, mái lưa thưa rủ xuống trán, có vệt bóng */}
      <path
        d="M32 33 C26 14 39 4 52 6 C65 5 75 15 68 32 C67 26 64 22 61 21 L59 28 L55 21.5 L51 29 L47 21.5 L43 27.5 L40.5 21.5 C37 24 34 28 32 33 Z"
        fill={palette.plum}
      />
      <path
        d="M43 11 Q51 7 59 11"
        fill="none"
        stroke="#fff"
        strokeOpacity={0.35}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Cô dâu đầm trắng xoè, voan, vương miện, bó hoa; tay trái chìa sang chú rể (12,100) */
export function Bride({ className }: { className?: string }) {
  return (
    <svg viewBox={CHIBI_VIEWBOX} className={className} aria-hidden>
      {/* Voan trắng phía sau */}
      <path
        d="M50 6 C26 14 22 70 18 126 Q50 134 82 126 C78 70 74 14 50 6 Z"
        fill="#fff"
        fillOpacity={0.75}
        stroke={palette.plum}
        strokeOpacity={0.45}
        strokeWidth={1.2}
      />
      <ellipse cx={50} cy={31} rx={18.5} ry={19} fill={palette.plum} />
      <circle cx={50} cy={12} r={7} fill={palette.plum} />
      <Arm from={[36, 66]} to={[12, 100]} color={figure.dress} />
      {/* Chân váy xoè + nếp váy */}
      <path
        d="M38 90 Q50 94 62 90 Q84 128 90 162 Q50 170 10 162 Q16 128 38 90 Z"
        fill={figure.dress}
        {...OUTLINE}
      />
      <path
        d="M28 160 Q35 128 44 96 M50 166 L50 97 M72 160 Q65 128 56 96"
        fill="none"
        stroke={figure.dressShade}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {/* Thân váy + đai hồng */}
      <path
        d="M36 62 Q50 56 64 62 L62 92 Q50 96 38 92 Z"
        fill={figure.dress}
        {...OUTLINE}
      />
      <path
        d="M38 87 Q50 91 62 87 L62 93 Q50 97 38 93 Z"
        fill={palette.blush}
        {...OUTLINE}
        strokeWidth={1.2}
      />
      <rect
        x={45.5}
        y={45}
        width={9}
        height={11}
        fill={figure.skin}
        {...OUTLINE}
      />
      <Face sparkle />
      {/* Tóc mái + vương miện vàng */}
      <path
        d="M34 30 C31 14 69 14 66 30 C60 21 42 20 34 30 Z"
        fill={palette.plum}
      />
      <path
        d="M39 17 L42 11 L46 15 L50 8 L54 15 L58 11 L61 17 Q50 13 39 17 Z"
        fill={palette.butter}
        {...OUTLINE}
        strokeWidth={1.2}
      />
      {/* Tay phải ôm bó hoa trước ngực */}
      <Arm from={[64, 66]} to={[58, 96]} color={figure.dress} />
      <g {...OUTLINE} strokeWidth={1.2}>
        <path d="M53 108 L58 100 L63 108 Z" fill="#7cc58a" />
        <circle cx={54} cy={98} r={5} fill={palette.bubblegum} />
        <circle cx={62} cy={97} r={5} fill={palette.lixi} />
        <circle cx={58} cy={104} r={5} fill={palette.butter} />
      </g>
    </svg>
  );
}

/**
 * Cảnh cuối sợi tơ hồng: chú rể và cô dâu tiến lại theo tiến độ cuộn, nắm tay đúng lúc
 * đầu sợi chỉ chạm tới tay hai người, rồi bật tim + bắn pháo tim (một lần).
 *
 * Bố cục: mỗi người rộng W (7rem, sm: 9rem), cao 1.72W; tay chìa ở 88% / 12% bề ngang và 58% chiều cao.
 * Đặt sao cho hai bàn tay gặp nhau đúng giữa khung; khối có margin âm để tay nằm ngay cuối sợi chỉ
 * (phần chứa sợi chỉ chừa sẵn pb bằng đúng khoảng này).
 */
export function CoupleFinale({
  progress,
  still,
}: {
  progress: MotionValue<number>;
  still: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const groomX = useTransform(progress, [0.7, 0.97], ["-60%", "0%"]);
  const brideX = useTransform(progress, [0.7, 0.97], ["60%", "0%"]);
  const appear = useTransform(progress, [0.55, 0.72], [0, 1]);
  const heart = useTransform(progress, [0.97, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    if (still || fired.current || v < 0.995 || !ref.current) return;
    fired.current = true;
    const r = ref.current.getBoundingClientRect();
    heartBurst({
      x: (r.left + r.width / 2) / window.innerWidth,
      y: (r.top + r.height * 0.5) / window.innerHeight,
    });
  });

  const fx = <T,>(v: T) => (still ? undefined : v);

  return (
    <div
      ref={ref}
      className="relative -mt-28 h-[12.04rem] sm:-mt-36 sm:h-[15.48rem]"
    >
      <motion.div
        className="absolute top-0 left-[calc(50%-6.16rem)] w-28 sm:left-[calc(50%-7.92rem)] sm:w-36"
        style={{ x: fx(groomX), opacity: fx(appear) }}
      >
        <Groom className="w-full" />
      </motion.div>
      <motion.div
        className="absolute top-0 left-[calc(50%-0.84rem)] w-28 sm:left-[calc(50%-1.08rem)] sm:w-36"
        style={{ x: fx(brideX), opacity: fx(appear) }}
      >
        <Bride className="w-full" />
      </motion.div>
      {/* Tim bung ra ngay trên đôi tay đang nắm */}
      <motion.svg
        viewBox="0 0 24 22"
        aria-hidden
        className="absolute top-28 left-1/2 w-11 -translate-x-1/2 -translate-y-[140%] drop-shadow-[2px_2px_0_var(--plum)] sm:top-36 sm:w-14"
        style={{ scale: fx(heart) }}
      >
        <path
          d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"
          fill={palette.lixi}
          stroke={palette.plum}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
