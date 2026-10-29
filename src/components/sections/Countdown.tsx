"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { type BearerGender, TrayBearer } from "./TrayBearer";
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
  gender: BearerGender;
  /** Mâm "ngày" là thông tin chính: đứng riêng một hàng trên mobile */
  main?: boolean;
}[] = [
  { key: "days", label: "ngày", gender: "male", main: true },
  { key: "hours", label: "giờ", gender: "female" },
  { key: "minutes", label: "phút", gender: "male" },
  { key: "seconds", label: "giây", gender: "female" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const isOver = (t: TimeLeft) => t.days + t.hours + t.minutes + t.seconds === 0;

/**
 * Số trượt lên khi đổi giá trị; khung overflow-hidden cắt phần trượt ra ngoài.
 * Khung nới thêm padding cho lớp bóng lệch .y2k-type (lệch 0.08em sang phải/xuống) khỏi bị cắt,
 * margin âm bù lại để kích thước ô không đổi.
 */
function RollingNumber({ value }: { value: string }) {
  return (
    <span className="relative -mx-[0.12em] -mb-[0.12em] inline-flex overflow-hidden px-[0.12em] pb-[0.12em]">
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
      <Section width="lg" className="text-center">
        <SectionHeading>
          {over ? "Hôm nay là ngày vui!" : "Còn bao lâu nữa?"}
        </SectionHeading>

        {!over && (
          <div
            role="timer"
            aria-live="off"
            className="grid grid-cols-3 items-end gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
          >
            {units.map(({ key, label, gender, main }, i) => (
              <div
                key={key}
                className={cn(
                  "mx-auto w-full max-w-48",
                  main && "col-span-3 max-w-52 sm:col-span-1 sm:max-w-48",
                )}
              >
                <TrayBearer gender={gender} index={i}>
                  <span
                    className={cn(
                      "font-numeric y2k-type leading-none font-black tabular-nums",
                      // Số 3 chữ số (ngày) cần nhỏ hơn để vừa nắp mâm
                      left && left[key] >= 100
                        ? "text-[22cqw]"
                        : "text-[28cqw]",
                    )}
                  >
                    {/* "--" giữ chỗ trước khi JS chạy để layout không nhảy */}
                    {left ? <RollingNumber value={pad(left[key])} /> : "--"}
                  </span>
                  <span className="text-[8cqw] font-semibold">{label}</span>
                </TrayBearer>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-sm sm:text-base">
          {over ? "Cảm ơn bạn đã đến chung vui cùng tụi mình" : "Tính tới"}{" "}
          {!over && (
            <strong>
              {formatTime(target)}, {formatWeekday(target)}{" "}
              {formatDotDate(target)}
            </strong>
          )}
        </p>
      </Section>
    </MotionConfig>
  );
}
