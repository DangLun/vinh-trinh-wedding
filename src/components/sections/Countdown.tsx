"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";
import {
  formatDotDate,
  formatTime,
  formatWeekday,
  type TimeLeft,
} from "@/lib/date";
import { easeLuxe } from "@/lib/motion";
import { LacquerBox } from "./LacquerBox";

const units: {
  key: keyof TimeLeft;
  label: string;
  /** Tráp "ngày" là thông tin chính: đứng riêng một hàng trên mobile */
  main?: boolean;
}[] = [
  { key: "days", label: "ngày", main: true },
  { key: "hours", label: "giờ" },
  { key: "minutes", label: "phút" },
  { key: "seconds", label: "giây" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const isOver = (t: TimeLeft) => t.days + t.hours + t.minutes + t.seconds === 0;

/** Số mới trượt lên thay số cũ; khung overflow-hidden cắt phần trượt ra ngoài. */
function RollingNumber({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: easeLuxe }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Countdown({
  target = wedding.date,
}: {
  /** Mốc đếm ngược (ISO); link mời riêng đếm tới lễ đầu tiên khách được mời */
  target?: string;
}) {
  const left = useCountdown(target);
  const over = left !== null && isOver(left);

  return (
    <MotionConfig reducedMotion="user">
      <div className="lacquer">
        <Section width="lg" className="text-center">
          <SectionHeading>
            {over ? "Hôm nay là ngày vui" : "Còn bao lâu nữa"}
          </SectionHeading>

          {!over && (
            <div
              role="timer"
              aria-live="off"
              className="grid grid-cols-3 items-end gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-8"
            >
              {units.map(({ key, label, main }) => (
                <div
                  key={key}
                  className={cn(
                    "mx-auto w-full max-w-44",
                    main && "col-span-3 max-w-48 sm:col-span-1 sm:max-w-44",
                  )}
                >
                  <LacquerBox>
                    <span
                      className={cn(
                        "figures font-serif leading-none font-light",
                        // Số 3 chữ số (ngày) cần nhỏ hơn để vừa thân tráp
                        left && left[key] >= 100
                          ? "text-[24cqw]"
                          : "text-[30cqw]",
                      )}
                    >
                      {/* "--" giữ chỗ trước khi JS chạy để layout không nhảy */}
                      {left ? <RollingNumber value={pad(left[key])} /> : "--"}
                    </span>
                    <span className="text-gold text-[8cqw] tracking-[0.14em]">
                      {label}
                    </span>
                  </LacquerBox>
                </div>
              ))}
            </div>
          )}

          <p className="text-ivory/70 mt-14 text-sm sm:text-base">
            {over ? "Cảm ơn bạn đã đến chung vui cùng tụi mình" : "Tính tới"}{" "}
            {!over && (
              <span className="text-ivory">
                {formatTime(target)}, {formatWeekday(target)}{" "}
                {formatDotDate(target)}
              </span>
            )}
          </p>
        </Section>
      </div>
    </MotionConfig>
  );
}
