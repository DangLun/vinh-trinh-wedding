"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type CSSProperties,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { palette } from "@/config/theme";
import {
  CURSOR_EVENT,
  type CursorVariant,
  INTERACTIVE_SELECTOR,
  VIEW_SELECTOR,
} from "@/lib/cursor";
import { hasFinePointer, subscribeFinePointer } from "@/lib/device";
import { easeLuxe } from "@/lib/motion";

const DOT_SIZE = 6;
const RING_SIZE = 40;
// Cỡ vòng (so với RING_SIZE) theo dạng con trỏ
const RING_SCALE = { default: 1, hover: 1.5, view: 2 } as const;

type Mode = keyof typeof RING_SCALE;

// Khối vuông có tâm đặt ở gốc toạ độ, để x/y của motion trỏ đúng vào tâm
const box = (size: number): CSSProperties => ({
  position: "absolute",
  top: -size / 2,
  left: -size / 2,
  width: size,
  height: size,
});

/**
 * Con trỏ: chấm nhỏ + vòng chỉ mảnh trễ nhịp theo sau. Trộn kiểu "difference" nên
 * thấy được trên cả nền ngà lẫn sơn mài. Rê lên ảnh thì vòng nở ra kèm chữ "Xem".
 * Chỉ bật với chuột thật; style inline, không phụ thuộc CSS toàn cục.
 */
export default function CustomCursor() {
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    hasFinePointer,
    () => false,
  );
  return fine ? <Cursor /> : null;
}

function Cursor() {
  const still = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Vòng đuổi theo chậm, không nảy; giảm chuyển động thì bám sát luôn
  const follow = still
    ? { stiffness: 10_000, damping: 500 }
    : { stiffness: 170, damping: 28, mass: 0.7 };
  const ringX = useSpring(x, follow);
  const ringY = useSpring(y, follow);

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [domMode, setDomMode] = useState<Mode>("default");
  const [externalHover, setExternalHover] = useState(false);
  const mode: Mode = externalHover && domMode === "default" ? "hover" : domMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      setDomMode(
        el?.closest?.(VIEW_SELECTOR)
          ? "view"
          : el?.closest?.(INTERACTIVE_SELECTOR)
            ? "hover"
            : "default",
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const external = (e: Event) =>
      setExternalHover((e as CustomEvent<CursorVariant>).detail === "hover");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener(CURSOR_EVENT, external);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener(CURSOR_EVENT, external);
      root.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  const press = pressed ? 0.85 : 1;
  const transition = { duration: 0.5, ease: easeLuxe };

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms",
      }}
    >
      <motion.div style={{ ...box(RING_SIZE), x: ringX, y: ringY }}>
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            border: `1px solid ${palette.ivory}`,
          }}
          animate={{ scale: RING_SCALE[mode] * press }}
          transition={transition}
        />
        <AnimatePresence>
          {mode === "view" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: palette.ivory,
                fontSize: 11,
                letterSpacing: "0.14em",
              }}
            >
              Xem
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div style={{ ...box(DOT_SIZE), x, y }}>
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            background: palette.ivory,
          }}
          animate={{ scale: mode === "default" ? press : 0 }}
          transition={transition}
        />
      </motion.div>
    </div>
  );
}
