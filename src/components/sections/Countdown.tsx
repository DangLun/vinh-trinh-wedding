"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { CSSProperties } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { palette, type PaletteColor } from "@/config/theme";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";
import {
  formatDotDate,
  formatTime,
  formatWeekday,
  type TimeLeft,
} from "@/lib/date";

const units: {
  key: keyof TimeLeft;
  label: string;
  tone: PaletteColor;
  /** Ô "ngày" là thông tin chính nên to và chiếm riêng một hàng trên mobile */
  main?: boolean;
}[] = [
  { key: "days", label: "ngày", tone: "butter", main: true },
  { key: "hours", label: "giờ", tone: "blush" },
  { key: "minutes", label: "phút", tone: "mist" },
  { key: "seconds", label: "giây", tone: "ice" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const isOver = (t: TimeLeft) => t.days + t.hours + t.minutes + t.seconds === 0;

/** Số trượt lên khi đổi giá trị; khung overflow-hidden cắt phần trượt ra ngoài */
function RollingNumber({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Countdown() {
  const left = useCountdown(wedding.date);
  const over = left !== null && isOver(left);

  return (
    <MotionConfig reducedMotion="user">
      <Section width="lg" className="text-center">
        <SectionHeading>
          {over ? "Hôm nay là ngày vui!" : "Còn bao lâu nữa?"}
        </SectionHeading>

        {!over && (
          <div
            role="timer"
            aria-live="off"
            className="grid grid-cols-3 gap-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr] sm:gap-5"
          >
            {units.map(({ key, label, tone, main }) => (
              <div
                key={key}
                className={cn(
                  "chrome-border flex flex-col items-center justify-center rounded-3xl py-5 shadow-[0_0_0_2px_var(--plum),6px_6px_0_var(--plum)] sm:py-7",
                  main && "col-span-3 sm:col-span-1",
                )}
                style={{ "--tile": palette[tone] } as CSSProperties}
              >
                <span
                  className={cn(
                    "font-numeric y2k-type leading-none font-black tabular-nums",
                    main
                      ? "text-[clamp(4rem,22vw,7.5rem)] sm:text-[clamp(3rem,7vw,5.5rem)]"
                      : "text-[clamp(2.25rem,11vw,5rem)] sm:text-[clamp(2.5rem,6vw,5rem)]",
                  )}
                >
                  {/* "--" giữ chỗ trước khi JS chạy để layout không nhảy */}
                  {left ? <RollingNumber value={pad(left[key])} /> : "--"}
                </span>
                <span className="mt-2 text-sm font-semibold sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-sm sm:text-base">
          {over ? "Cảm ơn bạn đã đến chung vui cùng tụi mình" : "Tính tới"}{" "}
          {!over && (
            <strong>
              {formatTime(wedding.date)}, {formatWeekday(wedding.date)}{" "}
              {formatDotDate(wedding.date)}
            </strong>
          )}
        </p>
      </Section>
    </MotionConfig>
  );
}
