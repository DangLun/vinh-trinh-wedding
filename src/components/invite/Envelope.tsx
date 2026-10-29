"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { button } from "@/components/ui/button";
import { CoupleName } from "@/components/ui/CoupleName";
import { Monogram } from "@/components/ui/Monogram";
import { palette } from "@/config/theme";
import { cn } from "@/lib/cn";
import { easeLuxe } from "@/lib/motion";

type Phase = "sealed" | "opening" | "letter" | "closed";

export type EnvelopeProps = {
  /** Người nhận, đã ghép người đi cùng: "Cô Ba và gia đình" */
  to: string;
  /** "Tụi con trân trọng kính mời" */
  verb: string;
  note?: string;
  /** Các lễ khách được mời, đã định dạng sẵn ở server */
  events: { title: string; when: string }[];
};

const curtain = [0.76, 0, 0.24, 1] as const;

/** Phong bì sơn then viền chỉ vàng, lót đỏ son; dấu sáp son in chữ lồng V & T là nút mở */
function EnvelopeArt({
  to,
  opening,
  onOpen,
}: {
  to: string;
  opening: boolean;
  onOpen: () => void;
}) {
  const edge = { stroke: palette.gold, strokeWidth: 1 } as const;
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="relative w-[min(86vw,26rem)]"
    >
      <p className="text-gold text-center text-xs tracking-[0.18em]">Gửi</p>
      <p className="text-ivory mt-1 mb-10 text-center font-serif text-3xl font-light italic">
        {to}
      </p>

      <div className="relative aspect-[3/2]">
        {/* Thân sau: mặt trong lót đỏ son, lộ ra khi nắp lật */}
        <div
          className="border-gold/60 absolute inset-0 border"
          style={{ background: palette.son }}
        />
        {/* Tấm thiệp ngà bên trong: trồi lên khi mở */}
        <motion.div
          className="bg-ivory absolute inset-x-[7%] top-[7%] bottom-[9%] z-10 grid place-items-center"
          initial={false}
          animate={{ y: opening ? "-46%" : "0%" }}
          transition={{ delay: 0.5, duration: 1, ease: easeLuxe }}
        >
          {/* Ẩn chữ khi phong bì còn dán để chữ không lấp ló qua mép nắp */}
          <span
            className={cn(
              "text-ink -mt-[30%] text-4xl transition-opacity duration-700",
              opening ? "opacity-100" : "opacity-0",
            )}
          >
            <CoupleName ampClassName="text-gold-deep" />
          </span>
        </motion.div>
        {/* Túi trước hình chữ V, sơn then */}
        <svg
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
          className="absolute inset-0 z-20 size-full"
          aria-hidden
        >
          <path
            d="M0.5 66 L150 140 L299.5 66 L299.5 199.5 L0.5 199.5 Z"
            fill={palette.lacquer}
            {...edge}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Nắp: lật ngược lên khi mở, lúc đó lùi ra sau tấm thiệp */}
        <motion.svg
          viewBox="0 0 300 140"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[70%] w-full origin-top"
          style={{ zIndex: opening ? 1 : 30, transformPerspective: 900 }}
          initial={false}
          animate={{ rotateX: opening ? 180 : 0 }}
          transition={{ duration: 0.8, ease: curtain }}
          aria-hidden
        >
          <path
            d="M0.5 0.5 L299.5 0.5 L150 124 Z"
            fill={palette.umber}
            {...edge}
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
        {/* Dấu sáp đỏ son = nút mở */}
        <motion.button
          type="button"
          autoFocus
          onClick={onOpen}
          aria-label="Mở thiệp mời"
          className="absolute top-[62%] left-1/2 z-40 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.03]"
          style={{
            background: `radial-gradient(circle at 35% 30%, #b82a2a 0%, ${palette.son} 55%, #6e1212 100%)`,
          }}
          initial={false}
          animate={
            opening ? { scale: 0.6, opacity: 0 } : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.5, ease: easeLuxe }}
        >
          <Monogram color={palette.gold} className="size-16" />
        </motion.button>
      </div>

      <p className="text-ivory/55 mt-10 text-center text-sm">
        Chạm vào dấu sáp để mở thiệp
      </p>
    </motion.div>
  );
}

function Letter({
  to,
  verb,
  note,
  events,
  onEnter,
}: EnvelopeProps & { onEnter: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: easeLuxe }}
      className="bg-ivory text-ink border-gold/60 relative w-[min(92vw,32rem)] border p-2"
    >
      <div className="border-gold/40 border px-6 py-12 text-center sm:px-12">
        <p className="font-serif text-2xl font-light italic">Gửi {to}</p>
        <p className="text-ink/80 mt-5 leading-relaxed">
          {verb} {to} đến chung vui trong ngày cưới của
        </p>
        <p className="mt-4 text-6xl leading-tight sm:text-7xl">
          <CoupleName ampClassName="text-gold-deep" />
        </p>

        <span aria-hidden className="bg-gold/60 mx-auto my-8 block h-px w-12" />

        <ul className="space-y-4">
          {events.map((e) => (
            <li key={e.title}>
              <p className="font-serif text-2xl">{e.title}</p>
              <p className="text-ink/70 text-sm first-letter:uppercase">
                {e.when}
              </p>
            </li>
          ))}
        </ul>

        {note && (
          <p className="text-gold-deep mt-8 font-serif text-xl italic">
            “{note}”
          </p>
        )}

        <button
          type="button"
          autoFocus
          onClick={onEnter}
          className={button({ tone: "son", className: "mt-10 px-10" })}
        >
          Vào xem thiệp
        </button>
      </div>
    </motion.article>
  );
}

/**
 * Màn mở đầu của link mời riêng: phong bì → thư mời ghi tên khách → vào trang cưới.
 * Chỉ nhận chuỗi đã chuẩn bị ở server, không nhập danh sách khách để danh sách
 * không lọt vào JavaScript gửi xuống trình duyệt.
 */
export default function Envelope(props: EnvelopeProps) {
  const still = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("sealed");

  // Khoá cuộn trang phía sau khi thiệp còn mở
  useEffect(() => {
    if (phase === "closed") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  // Nắp lật + thiệp trồi lên xong thì chuyển sang thư mời
  useEffect(() => {
    if (phase !== "opening") return;
    const id = setTimeout(() => setPhase("letter"), 1800);
    return () => clearTimeout(id);
  }, [phase]);

  const open = () => setPhase(still ? "letter" : "opening");

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {phase !== "closed" && (
          <motion.div
            key="invite"
            role="dialog"
            aria-modal
            aria-label={`Thiệp mời gửi ${props.to}`}
            // Lenis bỏ qua thao tác cuộn bên trong lớp này
            data-lenis-prevent
            exit={{ opacity: 0, transition: { duration: 1, ease: curtain } }}
            className="lacquer fixed inset-0 isolate z-[60] grid place-items-center overflow-y-auto p-4"
          >
            <AnimatePresence mode="wait">
              {phase === "letter" ? (
                <Letter
                  key="letter"
                  {...props}
                  onEnter={() => setPhase("closed")}
                />
              ) : (
                <EnvelopeArt
                  key="envelope"
                  to={props.to}
                  opening={phase === "opening"}
                  onOpen={open}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
