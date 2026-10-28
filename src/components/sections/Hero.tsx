"use client";

import { MotionConfig, motion } from "motion/react";
import HeroRings from "@/components/three/HeroRings";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { sticker } from "@/components/ui/sticker";
import { wedding } from "@/config/wedding";
import { formatDotDate, formatWeekday } from "@/lib/date";
import { springIn } from "@/lib/motion";

const day = formatDotDate(wedding.date);
const weekday = formatWeekday(wedding.date);

export default function Hero({ guestName }: { guestName?: string }) {
  // Một chuỗi xuất hiện duy nhất: lời mời → chú rể → & → cô dâu → ngày.
  // reducedMotion="user": bỏ trượt/xoay, chỉ giữ fade cho người bật giảm chuyển động.
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
        <GradientMesh />
        <HeroRings />

        <div className="pointer-events-none relative flex flex-1 flex-col px-5 pt-8 pb-10 sm:px-10">
          {guestName && (
            <motion.p
              {...springIn(0)}
              className={sticker({
                tone: "butter",
                className: "self-center px-5 py-2 text-sm",
              })}
            >
              Thân mời <strong>{guestName}</strong>
            </motion.p>
          )}

          <h1 className="font-display y2k-type my-auto grid w-full grid-cols-[minmax(0,1fr)] text-[clamp(3rem,14vw,11rem)] leading-[0.9] font-black tracking-tight">
            <motion.span {...springIn(1)} className="justify-self-start">
              {wedding.groom.name}
            </motion.span>
            <motion.span
              {...springIn(2)}
              aria-label="và"
              className={sticker({
                tone: "bubblegum",
                className:
                  "my-2 justify-self-center px-[0.35em] py-[0.05em] text-[0.35em] [text-shadow:none]",
              })}
            >
              &amp;
            </motion.span>
            <motion.span {...springIn(3)} className="justify-self-end">
              {wedding.bride.name}
            </motion.span>
          </h1>

          <motion.div
            {...springIn(4)}
            className="flex flex-col items-center gap-1 text-center"
          >
            <p
              className={sticker({
                shadow: false,
                className:
                  "font-display px-6 py-2 text-lg font-semibold sm:text-2xl",
              })}
            >
              {day}
            </p>
            <p className="text-sm first-letter:uppercase">{weekday}</p>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
