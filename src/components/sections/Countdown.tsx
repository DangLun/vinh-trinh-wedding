"use client";

import {
  AnimatePresence,
  animate,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { type BearerGender, TrayBearer } from "./TrayBearer";
import { cn } from "@/lib/cn";
import { maiBurst } from "@/lib/confetti";
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

/**
 * Số trên mâm: "00" khi người bưng chưa vào chỗ, vào chỗ rồi thì lăn từ 0 lên giá trị thật,
 * sau đó chạy theo đồng hồ như thường (RollingNumber).
 */
function TrayNumber({ value, arrived }: { value: number; arrived: boolean }) {
  const still = useReducedMotion();
  const [counted, setCounted] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  // Giá trị mới nhất, đọc đúng lúc bắt đầu đếm; giây nhảy giữa chừng không làm đếm lại
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  });

  useEffect(() => {
    if (!arrived || done || still) return;
    const controls = animate(0, latest.current, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => setCounted(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [arrived, done, still]);

  // Giảm chuyển động: bỏ đoạn đếm, hiện số thật ngay khi vào chỗ
  if (done || (arrived && still)) return <RollingNumber value={pad(value)} />;
  return <>{pad(counted ?? 0)}</>;
}

export default function Countdown() {
  const left = useCountdown(wedding.date);
  const over = left !== null && isOver(left);
  const team = useRef<HTMLDivElement>(null);
  // Đội bưng quả bắt đầu đi vào khi khối đếm ngược lộ ra khoảng 1/3
  const go = useInView(team, { once: true, amount: 0.35 });
  const [arrived, setArrived] = useState<boolean[]>(() =>
    units.map(() => false),
  );

  const onArrive = (i: number) => {
    setArrived((a) => a.map((v, k) => v || k === i));
    // Người cuối vào chỗ: bắn chùm hoa mai từ giữa đội
    if (i === units.length - 1 && team.current) {
      const r = team.current.getBoundingClientRect();
      maiBurst({
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height * 0.4) / window.innerHeight,
      });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <Section width="lg" className="text-center">
        <SectionHeading>
          {over ? "Hôm nay là ngày vui!" : "Còn bao lâu nữa?"}
        </SectionHeading>

        {!over && (
          <div
            ref={team}
            role="timer"
            aria-live="off"
            className="grid grid-cols-3 items-end gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
          >
            {units.map(({ key, label, gender, main }, i) => (
              // Bước từ mép trái màn hình vào chỗ, người sau trễ hơn người trước một nhịp
              <motion.div
                key={key}
                initial={{ x: "-110vw" }}
                animate={go ? { x: 0 } : undefined}
                transition={{
                  duration: 1.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.35,
                }}
                onAnimationComplete={() => onArrive(i)}
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
                    {left ? (
                      <TrayNumber value={left[key]} arrived={arrived[i]} />
                    ) : (
                      "--"
                    )}
                  </span>
                  <span className="text-[8cqw] font-semibold">{label}</span>
                </TrayBearer>
              </motion.div>
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
