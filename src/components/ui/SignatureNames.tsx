"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { couple } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { penStroke } from "@/lib/pen";

/**
 * Đường giữa của nét nối hai tên, vẽ một nét liền không nhấc bút: lượn sóng nhẹ, vòng lên
 * thành trái tim, đi xuống mũi tim thì vắt chéo qua đường cũ thành khuyên nhỏ rồi lượn sang tên sau.
 * Khung 120×50, chân đường quanh y=40 (khớp chân chữ).
 */
const HEART_LINE =
  "M0 39 C12 42 24 43.5 36 41.5 C45 40 53 40.5 61 43 C53 39 46 33 47.5 27 C49 21 58 20.5 61.5 27.5 C64 20.5 74 20.5 76 27 C78 34 69 40 60 44 C56 46 62 47.5 69 44.5 C79 40 93 37.5 105 38.5 C112 39.2 117 39.6 120 39";

// Nét ngòi nhọn như chữ Imperial Script: má phải trái tim (nét đi xuống) đậm, còn lại mảnh như tóc.
// Bản nhỏ (dòng thứ bậc trong thiệp) cần nét tóc dày hơn để không mờ mất.
const INK = penStroke(HEART_LINE, { hair: 1.2, thick: 4.4 });
const INK_SMALL = penStroke(HEART_LINE, { hair: 1.8, thick: 5.2 });

const shapes = (ink: string[]) => ink.map((d, i) => <path key={i} d={d} />);

/** Nét nối có vòng tim đứng riêng, vẽ tĩnh (vd giữa hai dòng thứ bậc "Út Nữ ♡ Trưởng Nam") */
export function HeartLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 50"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {shapes(INK_SMALL)}
    </svg>
  );
}

/**
 * Tên cặp đôi kiểu chữ ký trên thiệp giấy: "Trinh ——♡—— Vinh".
 * Cỡ chữ và màu lấy từ phần tử cha. `draw` true thì nét tim tự vẽ ra (sau khi thiệp hiện):
 * nét đậm nhạt là hình tô kín nên không vẽ dần được, thay vào đó một mặt nạ chạy dọc
 * đường giữa để lộ dần nét mực.
 */
export function SignatureNames({
  draw = false,
  delay = 0,
  className,
}: {
  draw?: boolean;
  delay?: number;
  className?: string;
}) {
  const mask = useId();
  return (
    <span
      className={cn(
        "font-signature inline-flex items-end leading-none whitespace-nowrap",
        className,
      )}
    >
      <span>{couple[0].name}</span>
      {/* Nét nối: chân đường (y=40/50) nằm ngang chân chữ viết tay */}
      <svg
        viewBox="0 0 120 50"
        fill="currentColor"
        aria-label="và"
        role="img"
        className="mx-[-0.06em] mb-[0.16em] h-[0.62em] w-[1.5em] shrink-0 overflow-visible"
      >
        {draw && (
          <mask
            id={mask}
            maskUnits="userSpaceOnUse"
            x={-10}
            y={0}
            width={140}
            height={60}
          >
            <motion.path
              d={HEART_LINE}
              fill="none"
              stroke="white"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay }}
            />
          </mask>
        )}
        <g mask={draw ? `url(#${mask})` : undefined}>{shapes(INK)}</g>
      </svg>
      <span>{couple[1].name}</span>
    </span>
  );
}
