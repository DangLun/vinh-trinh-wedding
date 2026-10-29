"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { couple } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { HEART_INK, HEART_INK_SMALL, HEART_LINE } from "@/lib/heart-line";

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
      {shapes(HEART_INK_SMALL)}
    </svg>
  );
}

/**
 * Tên cặp đôi kiểu chữ ký trên thiệp giấy: "Trinh ——♡—— Vinh".
 * Cỡ chữ và màu lấy từ phần tử cha; `lineClassName` đổi màu riêng nét tim. `draw` true thì nét tim tự vẽ ra (sau khi thiệp hiện):
 * nét đậm nhạt là hình tô kín nên không vẽ dần được, thay vào đó một mặt nạ chạy dọc
 * đường giữa để lộ dần nét mực.
 */
export function SignatureNames({
  draw = false,
  delay = 0,
  className,
  lineClassName,
}: {
  draw?: boolean;
  delay?: number;
  className?: string;
  lineClassName?: string;
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
        className={cn(
          "mx-[-0.06em] mb-[0.16em] h-[0.62em] w-[1.5em] shrink-0 overflow-visible",
          lineClassName,
        )}
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
        <g mask={draw ? `url(#${mask})` : undefined}>{shapes(HEART_INK)}</g>
      </svg>
      <span>{couple[1].name}</span>
    </span>
  );
}
