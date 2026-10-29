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
import { Monogram } from "@/components/ui/Monogram";
import { Section, SectionHeading } from "@/components/ui/Section";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { easeLuxe } from "@/lib/motion";
import type { StoryMilestone } from "@/types/wedding";

// Trục sợi chỉ: sát lề trái trên mobile, chính giữa từ sm trở lên
const AXIS = "left-5 sm:left-1/2";

/**
 * Một mốc trên sợi chỉ. "Chạm" khi mép trên của mốc vượt qua giữa màn hình,
 * cũng là lúc đầu sợi chỉ (bám theo giữa màn hình) đi tới đây.
 * Ảnh mở dần từ dưới lên (clip-path) đồng thời lắng từ 1.15 về 1; chữ hiện sau ảnh một nhịp.
 */
function Milestone({ item, index }: { item: StoryMilestone; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { once: true, margin: "0px 0px -50% 0px" });
  const still = useReducedMotion();
  const shown = reached || !!still;
  // Desktop: mốc chẵn nằm bên trái sợi chỉ, mốc lẻ bên phải
  const left = index % 2 === 0;
  const ease = { ease: easeLuxe };

  return (
    // Desktop: thẻ hai bên đan xen (margin âm) cho đỡ trống; thẻ khác phía nên không chồng lên nhau
    <li ref={ref} className="relative py-12 sm:py-16 sm:not-first:-mt-32">
      {/* Nút trên sợi chỉ: chấm son trong vòng vàng */}
      <motion.span
        aria-hidden
        className={cn(
          "border-gold bg-ivory absolute top-14 z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full border sm:top-18",
          AXIS,
        )}
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.8, ...ease }}
      >
        <span className="bg-son size-1.5 rounded-full" />
      </motion.span>
      <div
        className={cn(
          "ml-12 sm:w-[calc(50%-3.5rem)]",
          left ? "sm:mr-auto sm:ml-0 sm:text-right" : "sm:ml-auto",
        )}
      >
        {item.image && (
          <motion.div
            className="relative mb-6 aspect-[4/5] overflow-hidden"
            initial={false}
            animate={{
              clipPath: shown ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
            }}
            transition={{ duration: 1.6, ...ease }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ scale: shown ? 1 : 1.15 }}
              transition={{ duration: 1.8, ...ease }}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 640px) 26rem, 80vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
        <motion.div
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.2, delay: 0.3, ...ease }}
        >
          <p className="text-gold-deep font-serif text-xl italic">
            {item.date}
          </p>
          <h3 className="mt-1 font-serif text-3xl font-light sm:text-4xl">
            {item.title}
          </h3>
          <p className="text-ink/80 mt-3 leading-relaxed">{item.text}</p>
        </motion.div>
      </div>
    </li>
  );
}

/** Sợi chỉ đỏ son được kéo dài theo tiến độ cuộn */
function Thread({ progress }: { progress: MotionValue<number> }) {
  const clip = useTransform(progress, (v) => `inset(0 0 ${100 - v * 100}% 0)`);
  return (
    <motion.div
      className={cn("bg-son absolute inset-y-0 w-px -translate-x-1/2", AXIS)}
      style={{ clipPath: clip }}
    />
  );
}

/**
 * Cuối sợi chỉ: chữ lồng T & V, vòng ngoài được vẽ dần trong đoạn cuộn cuối,
 * như sợi chỉ thắt lại thành vòng.
 */
function Finale({
  progress,
  still,
}: {
  progress: MotionValue<number>;
  still: boolean;
}) {
  const draw = useTransform(progress, [0.9, 1], [0, 1]);
  const ring = (
    <motion.circle
      cx={60}
      cy={60}
      r={57}
      stroke={palette.son}
      strokeWidth={1}
      // Bắt đầu vẽ từ đỉnh vòng tròn, nơi sợi chỉ đi xuống
      transform="rotate(-90 60 60)"
      style={{ pathLength: still ? 1 : draw }}
    />
  );
  return (
    <div className="flex flex-col items-center text-center">
      <Monogram
        color={palette.goldDeep}
        ring={ring}
        className="size-28 sm:size-32"
      />
      <p className="mt-6 max-w-sm font-serif text-2xl font-light italic">
        Và rồi, mình về chung một nhà.
      </p>
    </div>
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
        <SectionHeading className="text-center">
          Chuyện tình mình
        </SectionHeading>
        <div ref={ref} className="relative pb-16">
          {/* Vệt mờ chỉ đường đi của sợi chỉ */}
          <div
            aria-hidden
            className={cn(
              "bg-gold/30 absolute inset-y-0 w-px -translate-x-1/2",
              AXIS,
            )}
          />
          {still ? (
            <div
              aria-hidden
              className={cn(
                "bg-son absolute inset-y-0 w-px -translate-x-1/2",
                AXIS,
              )}
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
        <Finale progress={scrollYProgress} still={!!still} />
      </Section>
    </MotionConfig>
  );
}
