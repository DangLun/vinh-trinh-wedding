"use client";

import {
  MotionConfig,
  motion,
  type MotionValue,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CoupleFinale } from "./Couple";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import type { StoryMilestone } from "@/types/wedding";

const HEART =
  "M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z";

// Trục sợi chỉ: sát lề trái trên mobile, chính giữa từ sm trở lên
const AXIS = "left-5 sm:left-1/2";

// Sợi tơ hồng: đỏ lì xì xen hồng nhạt chéo nhau cho ra vẻ chỉ xoắn
const TWINE = `repeating-linear-gradient(160deg, ${palette.lixi} 0 7px, ${palette.blush} 7px 10px)`;

function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden>
      <path
        d={HEART}
        fill={palette.lixi}
        stroke={palette.plum}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Một mốc trên sợi chỉ. "Chạm" khi mép trên của mốc vượt qua giữa màn hình,
 * cũng là lúc đầu sợi chỉ (bám theo giữa màn hình) đi tới đây.
 */
function Milestone({ item, index }: { item: StoryMilestone; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { once: true, margin: "0px 0px -50% 0px" });
  const still = useReducedMotion();
  const shown = reached || !!still;
  // Desktop: mốc chẵn nằm bên trái sợi chỉ, mốc lẻ bên phải
  const left = index % 2 === 0;

  return (
    // Desktop: thẻ hai bên đan xen (margin âm) cho đỡ trống; thẻ khác phía nên không chồng lên nhau
    <li ref={ref} className="relative py-10 sm:py-14 sm:not-first:-mt-24">
      {/* Nút trên sợi chỉ */}
      <motion.span
        aria-hidden
        className={cn(
          "border-plum bg-butter absolute top-12 z-10 size-5 -translate-x-1/2 rounded-full border-2 sm:top-16",
          AXIS,
        )}
        initial={false}
        animate={{ scale: shown ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
      />
      <motion.div
        initial={false}
        animate={
          shown
            ? { opacity: 1, x: 0, rotate: 0 }
            : { opacity: 0, x: left ? -40 : 40, rotate: left ? -3 : 3 }
        }
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className={cn(
          "border-plum ml-12 rounded-3xl border-2 bg-white/85 p-5 shadow-[5px_5px_0_var(--plum)] sm:w-[calc(50%-2.5rem)]",
          left ? "sm:mr-auto sm:ml-0" : "sm:ml-auto",
        )}
      >
        {item.image && (
          <div className="relative mb-4">
            {/* Miếng băng dính washi giữ ảnh như dán vào sổ lưu niệm */}
            <span
              aria-hidden
              className="bg-butter/80 absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3"
            />
            <div className="border-plum relative aspect-[4/3] overflow-hidden rounded-2xl border-2">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 640px) 22rem, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <p className="font-numeric y2k-type text-3xl font-black">{item.date}</p>
        <h3 className="font-display mt-1 text-2xl">{item.title}</h3>
        <p className="mt-2">{item.text}</p>
      </motion.div>
    </li>
  );
}

/** Sợi chỉ được kéo dài theo tiến độ cuộn, có trái tim dẫn đầu */
function Thread({ progress }: { progress: MotionValue<number> }) {
  const clip = useTransform(progress, (v) => `inset(0 0 ${100 - v * 100}% 0)`);
  const tip = useTransform(progress, (v) => `${v * 100}%`);
  // Trái tim đầu sợi chỉ ẩn đi khi chưa bắt đầu và khi đã thắt nút ở cuối
  const tipOpacity = useTransform(progress, [0, 0.02, 0.96, 1], [0, 1, 1, 0]);

  return (
    <>
      <motion.div
        className={cn("absolute inset-y-0 w-1 -translate-x-1/2", AXIS)}
        style={{ background: TWINE, clipPath: clip }}
      />
      <motion.div
        className={cn("absolute -translate-x-1/2 -translate-y-1/2", AXIS)}
        style={{ top: tip, opacity: tipOpacity }}
      >
        <Heart className="w-7 animate-pulse" />
      </motion.div>
    </>
  );
}

export default function LoveStory() {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  // 0 khi đầu danh sách chạm giữa màn hình → 1 khi cuối danh sách chạm giữa màn hình:
  // đầu sợi chỉ luôn nằm ngay giữa màn hình trong lúc cuộn
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <MotionConfig reducedMotion="user">
      <Section width="md">
        <SectionHeading>Chuyện tình mình</SectionHeading>
        {/* pb chừa chỗ để đầu sợi chỉ dừng đúng ở đôi tay cô dâu chú rể (CoupleFinale) */}
        <div ref={ref} className="relative pb-28 sm:pb-36">
          {/* Vệt mờ chỉ đường đi của sợi chỉ */}
          <div
            aria-hidden
            className={cn(
              "border-lixi/25 absolute inset-y-0 -translate-x-1/2 border-l-2 border-dashed",
              AXIS,
            )}
          />
          {still ? (
            <div
              aria-hidden
              className={cn("absolute inset-y-0 w-1 -translate-x-1/2", AXIS)}
              style={{ background: TWINE }}
            />
          ) : (
            <Thread progress={scrollYProgress} />
          )}

          <ol className="relative">
            {wedding.loveStory.map((item, i) => (
              <Milestone key={item.date} item={item} index={i} />
            ))}
          </ol>
        </div>
        <CoupleFinale progress={scrollYProgress} still={!!still} />
      </Section>
    </MotionConfig>
  );
}
