"use client";

import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import HeroRings from "@/components/three/HeroRings";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { sticker } from "@/components/ui/sticker";
import { wedding } from "@/config/wedding";
import { formatDotDate, formatWeekday } from "@/lib/date";
import { springIn } from "@/lib/motion";

export default function Hero({
  guestName,
  date = wedding.date,
}: {
  guestName?: string;
  /** Ngày hiện ở Hero; link mời riêng dùng ngày lễ đầu tiên khách được mời */
  date?: string;
}) {
  const day = formatDotDate(date);
  const weekday = formatWeekday(date);
  // Một chuỗi xuất hiện duy nhất: lời mời → chú rể → & → cô dâu → ngày.
  // reducedMotion="user": bỏ trượt/xoay, chỉ giữ fade cho người bật giảm chuyển động.
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  // 0 khi Hero vừa chạm đỉnh màn hình → 1 khi Hero cuộn khuất hẳn
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Cuộn xuống: hai tên tách ra hai phía, nhẫn thu nhỏ + xoay, ngày mờ dần. Cuộn lên thì ghép lại.
  const groomX = useTransform(p, [0, 0.8], ["0vw", "-45vw"]);
  const brideX = useTransform(p, [0, 0.8], ["0vw", "45vw"]);
  const ringScale = useTransform(p, [0, 0.8], [1, 0.55]);
  const ringRotate = useTransform(p, [0, 0.8], [0, 30]);
  const fade = useTransform(p, [0, 0.45], [1, 0]);
  // style chỉ nhận motion value khi được phép chuyển động; giảm chuyển động thì đứng yên
  const scrollFx = <T,>(value: T) => (still ? undefined : value);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        className="relative isolate flex min-h-svh flex-col overflow-hidden"
      >
        <GradientMesh />
        <HeroRings
          sceneStyle={{
            scale: scrollFx(ringScale),
            rotate: scrollFx(ringRotate),
          }}
          hintStyle={{ opacity: scrollFx(fade) }}
        />

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

          <h1 className="font-display y2k-type my-auto grid w-full grid-cols-[minmax(0,1fr)] text-[clamp(3.5rem,19vw,12rem)] leading-[0.95]">
            <motion.span
              {...springIn(1)}
              style={{ x: scrollFx(groomX) }}
              className="justify-self-start"
            >
              {wedding.groom.name}
            </motion.span>
            {/* Lớp ngoài mờ theo cuộn, lớp trong giữ hiệu ứng xuất hiện (cả hai cùng dùng opacity) */}
            <motion.span
              style={{ opacity: scrollFx(fade) }}
              className="my-2 justify-self-center text-[0.35em] leading-none"
            >
              <motion.span
                {...springIn(2)}
                aria-label="và"
                className={sticker({
                  tone: "bubblegum",
                  className:
                    "inline-block px-[0.35em] py-[0.05em] leading-[0.95] [text-shadow:none]",
                })}
              >
                &amp;
              </motion.span>
            </motion.span>
            <motion.span
              {...springIn(3)}
              style={{ x: scrollFx(brideX) }}
              className="justify-self-end"
            >
              {wedding.bride.name}
            </motion.span>
          </h1>

          <motion.div style={{ opacity: scrollFx(fade) }}>
            <motion.div
              {...springIn(4)}
              className="flex flex-col items-center gap-1 text-center"
            >
              <p
                className={sticker({
                  shadow: false,
                  className:
                    "font-numeric px-6 py-2 text-xl font-bold sm:text-3xl",
                })}
              >
                {day}
              </p>
              <p className="text-sm first-letter:uppercase">{weekday}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
