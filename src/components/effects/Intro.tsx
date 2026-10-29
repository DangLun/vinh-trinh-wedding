"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { palette } from "@/config/theme";
import {
  hasSeenIntro,
  INTRO_ID,
  INTRO_SEEN_KEY,
  markIntroOpen,
} from "@/lib/intro";
import { easeLuxe } from "@/lib/motion";

type Phase = "closed" | "opening" | "done";

const curtain = [0.76, 0, 0.24, 1] as const;

// Nhịp: chữ lồng vẽ xong ~1.2s, dừng một nhịp ngắn rồi mở cửa; cửa mở trong 1.1s (tổng ~2.5s)
const DRAW = 1;
const HOLD_UNTIL = 1.4;
const OPEN = 1.1;

// Ẩn màn ngay khi trình duyệt đọc tới, trước lần vẽ đầu, nếu khách đã xem rồi (không nháy)
const hideIfSeen = `try{if(localStorage.getItem("${INTRO_SEEN_KEY}")==="1")document.getElementById("${INTRO_ID}").hidden=true}catch(e){}`;

/**
 * Một cánh cửa sơn then: khung chỉ vàng lồng bên trong, mép giáp nhau có nét vàng.
 * Chữ lồng đặt ngay trên khe cửa, mỗi cánh chỉ hiện nửa của mình (overflow-hidden),
 * nên lúc cửa mở chữ tách đôi theo hai cánh.
 */
function Door({
  side,
  phase,
  still,
}: {
  side: "left" | "right";
  phase: Phase;
  still: boolean;
}) {
  const left = side === "left";
  const ring = (
    <motion.circle
      cx={60}
      cy={60}
      r={57}
      stroke={palette.gold}
      strokeWidth={1}
      transform="rotate(-90 60 60)"
      initial={{ pathLength: still ? 1 : 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: DRAW, delay: 0.2, ease: easeLuxe }}
    />
  );
  return (
    <motion.div
      className="lacquer absolute inset-y-0 w-1/2 overflow-hidden"
      style={left ? { left: 0 } : { right: 0 }}
      initial={false}
      animate={{
        x: phase === "closed" || still ? "0%" : left ? "-100%" : "100%",
      }}
      transition={{ duration: OPEN, ease: curtain }}
    >
      {/* Khung chỉ vàng trên mặt cánh cửa */}
      <div aria-hidden className="border-gold/25 absolute inset-[6%] border" />
      {/* Nét vàng ở mép cửa giáp nhau */}
      <div
        aria-hidden
        className={`bg-gold/70 absolute inset-y-0 w-px ${left ? "right-0" : "left-0"}`}
      />
      {/* Tâm chữ lồng nằm đúng trên khe cửa */}
      <div
        className={`absolute top-1/2 size-36 -translate-y-1/2 sm:size-44 ${left ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
      >
        <motion.div
          className="size-full"
          initial={{ opacity: still ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Monogram ring={ring} className="size-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Màn mở đầu của trang chung: hai cánh cửa sơn mài đóng kín, chữ lồng V & T vẽ dần,
 * rồi cửa mở sang hai bên như cửa nhà ngày rước dâu, để lộ Hero phía sau.
 * Chỉ chạy lần đầu (localStorage); có nút bỏ qua; giảm chuyển động thì chỉ mờ dần.
 */
export default function Intro() {
  const still = !!useReducedMotion();
  // Cùng nguồn với inline script để giá trị ban đầu khớp với DOM lúc hydrate
  const [seen] = useState(() =>
    typeof window === "undefined" ? false : hasSeenIntro(),
  );
  // Lần vẽ đầu luôn có màn (khớp HTML từ server); đã xem thì màn chỉ bị ẩn
  const [phase, setPhase] = useState<Phase>("closed");

  const open = () => {
    if (phase !== "closed") return;
    markIntroOpen();
    setPhase("opening");
  };

  useEffect(() => {
    // Đã xem: màn đã bị ẩn (hidden) từ lúc tải, để yên không chạy gì
    if (seen) return;
    // Ghi nhận đã xem ngay từ đầu: tải lại trang giữa chừng cũng không phải xem lại
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Không lưu được thì lần sau xem lại, không sao
    }
  }, [seen]);

  // Tự mở cửa sau khi chữ lồng vẽ xong
  useEffect(() => {
    if (seen || phase !== "closed") return;
    const id = setTimeout(
      () => {
        markIntroOpen();
        setPhase("opening");
      },
      (still ? 1 : HOLD_UNTIL) * 1000,
    );
    return () => clearTimeout(id);
  }, [seen, phase, still]);

  // Cửa mở xong thì gỡ màn; giảm chuyển động thì gỡ luôn (màn chỉ mờ dần lúc thoát)
  useEffect(() => {
    if (phase !== "opening") return;
    const id = setTimeout(() => setPhase("done"), still ? 0 : OPEN * 1000);
    return () => clearTimeout(id);
  }, [phase, still]);

  // Khoá cuộn trang phía sau trong lúc màn còn che
  useEffect(() => {
    if (seen || phase === "done") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [seen, phase]);

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            id={INTRO_ID}
            key="intro"
            // inline script có thể đã đặt hidden trước khi React hydrate: giữ nguyên DOM
            suppressHydrationWarning
            hidden={seen}
            className="fixed inset-0 z-[70]"
            exit={{ opacity: 0, transition: { duration: still ? 0.8 : 0.3 } }}
          >
            <Door side="left" phase={phase} still={still} />
            <Door side="right" phase={phase} still={still} />
            <motion.button
              type="button"
              onClick={open}
              className="text-ivory/60 hover:text-ivory absolute right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] min-h-11 px-3 text-xs tracking-[0.14em] transition-colors"
              animate={{ opacity: phase === "closed" ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              Bỏ qua
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: hideIfSeen }}
      />
    </>
  );
}
