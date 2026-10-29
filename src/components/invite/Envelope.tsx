"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { sticker } from "@/components/ui/sticker";
import { palette } from "@/config/theme";
import { coupleName } from "@/config/wedding";
import { cn } from "@/lib/cn";
import { heartBurst } from "@/lib/confetti";

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

const HEART =
  "M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z";

// Đỏ sơn mài đậm hơn lixi một chút cho thân phong bì có chiều sâu
const ENVELOPE_BACK = "#b81f37";
const FLAP = "#e8495d";

/** Phong bì đỏ dán sáp tim; chạm con dấu thì nắp lật, thiệp trồi lên */
function EnvelopeArt({
  to,
  opening,
  onOpen,
}: {
  to: string;
  opening: boolean;
  onOpen: () => void;
}) {
  const stroke = {
    stroke: palette.plum,
    strokeWidth: 3,
    strokeLinejoin: "round",
  } as const;
  return (
    <motion.div
      exit={{ y: 120, opacity: 0, transition: { duration: 0.45 } }}
      className="relative w-[min(86vw,24rem)]"
    >
      <p className="font-display mb-8 text-center text-3xl">Gửi {to}</p>

      <div className="relative aspect-[3/2]">
        {/* Thân sau */}
        <div
          className="border-plum absolute inset-0 rounded-2xl border-2 shadow-[6px_6px_0_var(--plum)]"
          style={{ background: ENVELOPE_BACK }}
        />
        {/* Tấm thiệp bên trong: trồi lên khi mở */}
        <motion.div
          className="border-plum bg-milk absolute inset-x-[8%] top-[8%] bottom-[10%] z-10 grid place-items-center rounded-xl border-2"
          initial={false}
          animate={{ y: opening ? "-48%" : "0%" }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ẩn chữ khi phong bì còn dán để chữ không lấp ló qua mép nắp */}
          <span
            className={cn(
              "font-display y2k-type -mt-[30%] text-3xl transition-opacity duration-300",
              opening ? "opacity-100" : "opacity-0",
            )}
          >
            {coupleName}
          </span>
        </motion.div>
        {/* Túi trước hình chữ V */}
        <svg
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
          className="absolute inset-0 z-20 size-full"
          aria-hidden
        >
          <path
            d="M2 70 L150 142 L298 70 L298 186 Q298 198 286 198 L14 198 Q2 198 2 186 Z"
            fill={palette.lixi}
            {...stroke}
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
          transition={{ duration: 0.45, ease: "easeInOut" }}
          aria-hidden
        >
          <path d="M2 2 L298 2 L150 126 Z" fill={FLAP} {...stroke} />
        </motion.svg>
        {/* Con dấu sáp hình tim = nút mở */}
        <motion.button
          type="button"
          autoFocus
          onClick={onOpen}
          aria-label="Mở thiệp mời"
          className="border-plum absolute top-[62%] left-1/2 z-40 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 shadow-[3px_3px_0_var(--plum)]"
          style={{ background: palette.butter }}
          initial={false}
          animate={opening ? { scale: 0, opacity: 0 } : { scale: [1, 1.08, 1] }}
          transition={
            opening
              ? { duration: 0.2 }
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg viewBox="0 0 24 22" className="w-8" aria-hidden>
            <path
              d={HEART}
              fill={palette.lixi}
              stroke={palette.plum}
              strokeWidth={1.6}
            />
          </svg>
        </motion.button>
      </div>

      <p className="mt-8 text-center text-sm opacity-80">
        Chạm vào con dấu để mở thiệp
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
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="border-plum relative w-[min(92vw,30rem)] rounded-3xl border-2 bg-white px-6 py-8 text-center shadow-[6px_6px_0_var(--plum)] sm:px-10"
    >
      <p className="font-display text-3xl">Gửi {to}</p>
      <p className="mt-4 leading-relaxed">
        {verb} <strong>{to}</strong> đến chung vui trong ngày cưới của
      </p>
      <p className="font-display y2k-type mt-2 text-5xl sm:text-6xl">
        {coupleName}
      </p>

      <ul className="mt-6 space-y-2">
        {events.map((e) => (
          <li key={e.title}>
            <strong>{e.title}</strong>
            <span className="block text-sm sm:inline sm:text-base">
              <span className="hidden sm:inline"> · </span>
              {e.when}
            </span>
          </li>
        ))}
      </ul>

      {note && (
        <p className="bg-cream border-plum mt-6 rounded-2xl border-2 border-dashed px-4 py-3 italic">
          “{note}”
        </p>
      )}

      <button
        type="button"
        autoFocus
        onClick={onEnter}
        className={sticker({
          tone: "bubblegum",
          className: "mt-7 min-h-12 px-7 text-base font-semibold",
        })}
      >
        Mở thiệp ✦
      </button>
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
    const id = setTimeout(() => setPhase("letter"), 1300);
    return () => clearTimeout(id);
  }, [phase]);

  const open = () => setPhase(still ? "letter" : "opening");
  const enter = () => {
    setPhase("closed");
    heartBurst();
  };

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
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="bg-milk fixed inset-0 isolate z-[60] grid place-items-center overflow-y-auto p-4"
          >
            <GradientMesh />
            <AnimatePresence mode="wait">
              {phase === "letter" ? (
                <Letter key="letter" {...props} onEnter={enter} />
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
