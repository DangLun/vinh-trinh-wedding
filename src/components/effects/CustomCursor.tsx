"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { palette } from "@/config/theme";
import {
  CURSOR_EVENT,
  type CursorVariant,
  INTERACTIVE_SELECTOR,
} from "@/lib/cursor";
import { hasFinePointer, subscribeFinePointer } from "@/lib/device";

const SPARKLE_PATH =
  "M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z";
const TRAIL_COLORS = [
  palette.bubblegum,
  palette.lilac,
  palette.sky,
  palette.butter,
];
// Rải một ngôi sao mỗi TRAIL_SPACING px chuột đi được, tối đa TRAIL_PER_EVENT sao mỗi lần di
const TRAIL_SPACING = 10;
const TRAIL_PER_EVENT = 6;
const TRAIL_SCATTER = 10;
const STAR_SIZE = 22;
const RING_SIZE = 40;

// Khối vuông có tâm đặt ở gốc toạ độ, để x/y của motion trỏ đúng vào tâm
const box = (size: number): CSSProperties => ({
  position: "absolute",
  top: -size / 2,
  left: -size / 2,
  width: size,
  height: size,
});

// Viền ánh xà cừ: nền conic + mask khoét rỗng giữa
const ringMask = `radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))`;
const ringStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "9999px",
  background: `conic-gradient(${palette.bubblegum}, ${palette.lilac}, ${palette.sky}, ${palette.butter}, ${palette.bubblegum})`,
  WebkitMask: ringMask,
  mask: ringMask,
};
const TRAIL_MAX = 90;

/** Con trỏ Y2K: sao 4 cánh + vòng bong bóng đuổi theo + vệt sao. Chỉ bật với chuột thật. */
export default function CustomCursor() {
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    hasFinePointer,
    () => false,
  );
  return fine ? <Cursor /> : null;
}

const SVG_NS = "http://www.w3.org/2000/svg";

// Vệt sao dùng style inline + Web Animations API, không phụ thuộc CSS toàn cục
function spawnSparkle(layer: HTMLElement, x: number, y: number) {
  if (layer.childElementCount >= TRAIL_MAX) layer.firstElementChild?.remove();
  const size = 8 + Math.random() * 8;
  const drift = (Math.random() - 0.5) * 40;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute(
    "fill",
    TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
  );
  Object.assign(svg.style, {
    position: "fixed",
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    pointerEvents: "none",
  });
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", SPARKLE_PATH);
  svg.appendChild(path);
  layer.appendChild(svg);

  svg
    .animate(
      [
        { opacity: 1, transform: "scale(1) rotate(0deg)" },
        {
          opacity: 0,
          transform: `translate(${drift}px, 24px) scale(0) rotate(90deg)`,
        },
      ],
      {
        duration: 800 + Math.random() * 300,
        easing: "ease-out",
        fill: "forwards",
      },
    )
    .finished.then(
      () => svg.remove(),
      () => svg.remove(),
    );
}

function Cursor() {
  const still = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Vòng bong bóng trễ nhịp theo lò xo; giảm chuyển động thì bám sát luôn
  const spring = still
    ? { stiffness: 10_000, damping: 500 }
    : { stiffness: 320, damping: 26, mass: 0.6 };
  const ringX = useSpring(x, spring);
  const ringY = useSpring(y, spring);

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [domHover, setDomHover] = useState(false);
  const [externalHover, setExternalHover] = useState(false);
  const hover = domHover || externalHover;
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("custom-cursor");
    // Điểm rải sao gần nhất; null = chưa có (vừa vào trang/quay lại cửa sổ)
    let last: { x: number; y: number } | null = null;

    const sprinkle = (layer: HTMLElement, tx: number, ty: number) => {
      if (!last) {
        last = { x: tx, y: ty };
        return;
      }
      const dx = tx - last.x;
      const dy = ty - last.y;
      const steps = Math.min(
        TRAIL_PER_EVENT,
        Math.floor(Math.hypot(dx, dy) / TRAIL_SPACING),
      );
      if (steps === 0) return;
      // Nội suy dọc đường đi để vệt không đứt quãng khi rê nhanh
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const jitter = () => (Math.random() - 0.5) * TRAIL_SCATTER * 2;
        spawnSparkle(
          layer,
          last.x + dx * t + jitter(),
          last.y + dy * t + jitter(),
        );
      }
      last = { x: tx, y: ty };
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      if (!still && trail.current) {
        sprinkle(trail.current, e.clientX, e.clientY);
      }
    };
    const over = (e: PointerEvent) =>
      setDomHover(
        !!(e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR),
      );
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      setVisible(false);
      last = null;
    };
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
  }, [still, x, y]);

  const press = pressed ? 0.8 : 1;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms",
      }}
    >
      <div ref={trail} />

      {/* Vòng bong bóng ánh xà cừ */}
      <motion.div style={{ ...box(RING_SIZE), x: ringX, y: ringY }}>
        <motion.div
          style={ringStyle}
          animate={{ scale: (hover ? 1.6 : 1) * press }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        />
      </motion.div>

      {/* Sao 4 cánh — điểm trỏ chính xác ở tâm */}
      <motion.div style={{ ...box(STAR_SIZE), x, y }}>
        <motion.svg
          viewBox="0 0 24 24"
          width={STAR_SIZE}
          height={STAR_SIZE}
          overflow="visible"
          animate={{
            rotate: hover ? 45 : 0,
            scale: (hover ? 0.85 : 1) * press,
            color: hover ? palette.bubblegum : palette.plum,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <path
            d={SPARKLE_PATH}
            fill="currentColor"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}
