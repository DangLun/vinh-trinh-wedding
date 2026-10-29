"use client";

import {
  MotionConfig,
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { CoupleName } from "@/components/ui/CoupleName";
import { MaiBranch } from "@/components/ui/MaiFlower";
import { palette } from "@/config/theme";
import { lunarOf, lunarYear, wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { formatDotDate, formatWeekday } from "@/lib/date";
import { useIntroOpen } from "@/lib/intro";
import { easeLuxe, riseIn } from "@/lib/motion";

// Khung vòm bằng clip-path: bán kính 999px bị trình duyệt thu về đúng nửa bề ngang → nửa hình tròn.
// Mở từ dưới lên: mép trên đi từ 100% về 0%, đỉnh vòm luôn tròn trong lúc mở.
const ARCH_CLOSED = "inset(100% 0 0 0 round 999px 999px 0 0)";
const ARCH_OPEN = "inset(0% 0 0 0 round 999px 999px 0 0)";

// Tên "viết" dần từ trái sang: mép phải của vùng cắt lùi từ 100% về 0%
const INK_HIDDEN = "inset(0 100% 0 0)";
const INK_SHOWN = "inset(0 0% 0 0)";

/**
 * Ảnh chân dung trong khung vòm (gợi cửa nhà xưa, cổng hoa cưới), viền chỉ vàng bao ngoài.
 * Vòm mở từ dưới lên khi cửa màn mở đầu vừa hé; ảnh lắng chậm từ 1.15 về 1 trong 8 giây;
 * cuộn xuống thì ảnh trôi chậm hơn khung.
 */
function ArchPortrait({
  play,
  drift,
  className,
}: {
  play: boolean;
  drift?: MotionValue<string>;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[3/4]", className)}>
      {/* Viền vòm vàng lá, cách ảnh một khoảng như khung tranh */}
      <motion.div
        aria-hidden
        className="border-gold/50 absolute -inset-2.5 rounded-t-full border sm:-inset-3.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 1.6, delay: 1.4 }}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: ARCH_CLOSED }}
        animate={{ clipPath: play ? ARCH_OPEN : ARCH_CLOSED }}
        transition={{ duration: 1.8, ease: easeLuxe, delay: 0.2 }}
      >
        {/* Lớp ảnh cao hơn khung 12% để trôi theo cuộn không lộ mép */}
        <motion.div
          className="absolute inset-x-0 -inset-y-[6%]"
          style={{ y: drift }}
        >
          <motion.div
            className="size-full"
            initial={{ scale: 1.15 }}
            animate={{ scale: play ? 1 : 1.15 }}
            transition={{ duration: 8, ease: easeLuxe, delay: 0.2 }}
          >
            <Image
              src={wedding.heroImage.src}
              alt={wedding.heroImage.alt}
              fill
              priority
              sizes="(min-width: 768px) 22rem, 62vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
        {/* Đáy ảnh tối dần vào nền sơn mài để tên đè lên vẫn đọc rõ */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background: `linear-gradient(to top, ${palette.lacquer}e6, transparent)`,
          }}
        />
      </motion.div>
    </div>
  );
}

export default function Hero({
  guestName,
  date = wedding.date,
}: {
  guestName?: string;
  /** Ngày hiện ở Hero; link mời riêng dùng ngày lễ đầu tiên khách được mời */
  date?: string;
}) {
  const lunar = lunarOf(date);
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  // Trang chung có màn mở đầu: chờ cửa mở rồi mới chạy chuỗi xuất hiện
  const play = useIntroOpen();
  // 0 khi Hero vừa chạm đỉnh màn hình → 1 khi Hero cuộn khuất hẳn
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Cuộn xuống: ảnh trôi chậm trong khung, tên nâng lên nhẹ rồi cùng phần ngày mờ dần
  const drift = useTransform(p, [0, 1], ["0%", "10%"]);
  const lift = useTransform(p, [0, 0.8], ["0vh", "-8vh"]);
  const fade = useTransform(p, [0, 0.45], [1, 0]);
  const nameFade = useTransform(p, [0.2, 0.7], [1, 0]);
  // style chỉ nhận motion value khi được phép chuyển động; giảm chuyển động thì đứng yên
  const scrollFx = <T,>(value: T) => (still ? undefined : value);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        className="lacquer relative isolate flex min-h-svh flex-col overflow-hidden"
      >
        {/* Quầng vàng lá sau khung ảnh, như ánh nến hắt lên mặt sơn */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(40% 40% at 50% 45%, ${palette.gold}24 0%, transparent 70%)`,
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: play ? 1 : 0 }}
          transition={{ duration: 2.4, delay: 1.6 }}
        >
          {/* Mobile: cành nhỏ hơn, lùi sâu ra mép để không đè lên dòng ngày âm lịch */}
          <MaiBranch className="absolute -bottom-10 -left-12 w-[42vw] opacity-70 sm:-bottom-6 sm:-left-8 sm:w-[min(46vw,26rem)] sm:opacity-80" />
          <MaiBranch className="absolute -top-8 -right-10 w-[34vw] rotate-180 opacity-50 sm:-top-6 sm:-right-8 sm:w-[min(40vw,22rem)] sm:opacity-60" />
        </motion.div>

        {/* pb mobile chừa chỗ cho cành mai góc dưới, chữ ngày nằm hẳn phía trên cành */}
        <div className="relative flex flex-1 flex-col px-5 pt-12 pb-28 sm:px-10 sm:pb-14">
          {guestName && (
            <motion.p
              {...riseIn(0, undefined, play)}
              className="mb-8 text-center"
            >
              <span className="text-gold block text-xs tracking-[0.18em]">
                Thân mời
              </span>
              <span className="mt-1 block font-serif text-2xl italic sm:text-3xl">
                {guestName}
              </span>
            </motion.p>
          )}

          <div className="my-auto flex flex-col items-center">
            <ArchPortrait
              play={play}
              drift={scrollFx(drift)}
              className="w-[min(62vw,19rem)] md:w-[min(30vw,22rem)]"
            />
            {/*
             * Tên viết liền một khối, đè lên đáy khung vòm (phần ảnh đã tối dần).
             * Vùng cắt nới 0.3em mỗi phía (padding + margin âm) để nét lượn của thư pháp
             * vươn ra ngoài khung chữ không bị cắt trong lúc "viết".
             */}
            <motion.h1
              style={{ y: scrollFx(lift), opacity: scrollFx(nameFade) }}
              className="relative z-10 -mt-[0.62em] text-center text-[clamp(3.5rem,15vw,8.5rem)] leading-none whitespace-nowrap"
            >
              <motion.span
                className="-m-[0.3em] block p-[0.3em]"
                initial={{ clipPath: still ? INK_SHOWN : INK_HIDDEN }}
                animate={{ clipPath: play || still ? INK_SHOWN : INK_HIDDEN }}
                transition={{
                  duration: 2.4,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.9,
                }}
              >
                <CoupleName />
              </motion.span>
            </motion.h1>
          </div>

          <motion.div style={{ opacity: scrollFx(fade) }} className="mt-10">
            <motion.div
              {...riseIn(5, 0.9, play)}
              className="flex flex-col items-center text-center"
            >
              <span aria-hidden className="bg-gold/60 mb-6 h-px w-14" />
              <p className="figures font-serif text-3xl tracking-[0.18em] sm:text-4xl">
                <time dateTime={date}>{formatDotDate(date)}</time>
              </p>
              <p className="text-ivory/70 mt-3 text-sm first-letter:uppercase">
                {formatWeekday(date)}
              </p>
              {lunar && (
                <p className="text-gold mt-1 font-serif text-lg italic">
                  {lunar}, {lunarYear}
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
