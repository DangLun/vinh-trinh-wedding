"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import {
  garlandPhotos,
  HangingPolaroid,
  PHOTOS_PER_LINE,
  Thread,
} from "@/components/ui/Garland";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/wedding";

type Side = "left" | "right";

/**
 * Điểm kẹp trên dây, theo hệ toạ độ của khung lề: x là % bề ngang lề, y là ‰ chiều cao.
 * Dây lượn qua lại nhẹ giữa các điểm kẹp; điểm kẹp dịch ra phía mép ngoài màn hình.
 */
function clipPoints(side: Side) {
  return Array.from({ length: PHOTOS_PER_LINE }, (_, i) => {
    const wobble = i % 2 === 0 ? -5 : 5;
    const x = side === "left" ? 42 + wobble : 58 - wobble;
    return { x, y: ((i + 0.5) / PHOTOS_PER_LINE) * 1000 };
  });
}

type Point = { x: number; y: number };
/** Một đoạn cong Bézier bậc 3: điểm đầu, hai điểm điều khiển, điểm cuối */
type Segment = [Point, Point, Point, Point];

/** Các đoạn dây cong võng từ mép trên đi qua các điểm kẹp, kết thúc ở kẹp cuối */
function stringSegments(points: Point[], side: Side): Segment[] {
  const top = side === "left" ? 42 : 58;
  const all = [{ x: top, y: 0 }, ...points];
  return all.slice(1).map((p, i) => {
    const prev = all[i];
    const half = (p.y - prev.y) / 2;
    return [
      prev,
      { x: prev.x, y: prev.y + half },
      { x: p.x, y: p.y - half },
      p,
    ];
  });
}

function stringPath(segments: Segment[]) {
  return segments.reduce(
    (d, [, c1, c2, p]) =>
      `${d} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p.x} ${p.y}`,
    `M ${segments[0][0].x} ${segments[0][0].y}`,
  );
}

/** Điểm trên đoạn Bézier tại t ∈ [0,1] (dùng để kết hoa mai đúng lên dây) */
function pointAt([p0, p1, p2, p3]: Segment, t: number): Point {
  const u = 1 - t;
  const f = (a: number, b: number, c: number, d: number) =>
    u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  return {
    x: f(p0.x, p1.x, p2.x, p3.x),
    y: f(p0.y, p1.y, p2.y, p3.y),
  };
}

// Kết mai ở phần dây hở dưới mỗi ảnh (nửa trên đoạn dây bị ảnh che): một chùm to, một bông nhỏ
const BLOSSOM_AT = [0.66, 0.86];

function HangingPhoto({
  img,
  point,
  index,
  side,
  swing,
  still,
}: {
  img: GalleryImage;
  point: { x: number; y: number };
  index: number;
  side: Side;
  swing: MotionValue<number>;
  still: boolean;
}) {
  // Nghiêng sẵn ra phía ngoài, mỗi ảnh một góc; quán tính cuộn làm lệch thêm
  const tilt = (side === "left" ? -1 : 1) * (3 + (index % 3) * 1.5);
  const factor = [1, -0.8, 1.2, -1, 0.9][index % 5];
  const rotate = useTransform(swing, (s) => tilt + (still ? 0 : s * factor));

  return (
    <motion.div
      className="absolute w-[min(16rem,calc((100vw-64rem)/2))] origin-top"
      style={{
        left: `${point.x}%`,
        top: `${point.y / 10}%`,
        x: "-50%",
        rotate,
      }}
    >
      <HangingPolaroid img={img} index={index} sizes="256px" still={still} />
    </motion.div>
  );
}

function Garland({
  side,
  items,
  swing,
  still,
}: {
  side: Side;
  items: GalleryImage[];
  swing: MotionValue<number>;
  still: boolean;
}) {
  const points = clipPoints(side);
  const segments = stringSegments(points, side);
  const blossoms = segments.flatMap((seg) =>
    BLOSSOM_AT.map((t) => pointAt(seg, t)),
  );
  const d = stringPath(segments);
  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-[calc((100vw-64rem)/2)]",
        side === "left" ? "left-0" : "right-0",
      )}
    >
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <Thread d={d} />
      </svg>
      {blossoms.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2",
            i % 2 === 0 ? "size-8" : "size-6",
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y / 10}%`,
            rotate: `${i * 37}deg`,
          }}
        >
          <MaiFlower />
        </svg>
      ))}
      {items.map((img, i) => (
        <HangingPhoto
          key={img.src}
          img={img}
          point={points[i]}
          index={i}
          side={side}
          swing={swing}
          still={still}
        />
      ))}
    </div>
  );
}

/**
 * Hai sợi dây tơ hồng kết hoa mai treo ảnh polaroid chạy dọc hai lề (chỉ màn hình ≥1400px),
 * bắt đầu ngay dưới Hero. Màn hẹp hơn dùng PhotoLine (dây ngang) thay thế. Ảnh đung đưa nhẹ; cuộn nhanh thì lắc mạnh rồi dừng dần.
 */
export default function HangingPhotos() {
  const still = !!useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  // Vận tốc cuộn → góc lắc; lò xo ít giảm chấn nên dừng cuộn vẫn đung đưa thêm vài nhịp
  const kick = useTransform(velocity, (v) =>
    Math.max(-9, Math.min(9, v / 140)),
  );
  const swing = useSpring(kick, { stiffness: 70, damping: 6, mass: 1 });

  if (!garlandPhotos) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[100svh] bottom-56 -z-[5] hidden min-[1400px]:block"
    >
      <Garland
        side="left"
        items={garlandPhotos[0]}
        swing={swing}
        still={still}
      />
      <Garland
        side="right"
        items={garlandPhotos[1]}
        swing={swing}
        still={still}
      />
    </div>
  );
}
