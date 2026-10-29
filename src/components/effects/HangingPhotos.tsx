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
import Image from "next/image";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/wedding";

const PER_SIDE = 5;

const photos = wedding.gallery.filter(
  (item): item is GalleryImage => item.type === "image",
);

type Side = "left" | "right";

/**
 * Điểm kẹp trên dây, theo hệ toạ độ của khung lề: x là % bề ngang lề, y là ‰ chiều cao.
 * Dây lượn qua lại nhẹ giữa các điểm kẹp; điểm kẹp dịch ra phía mép ngoài màn hình.
 */
function clipPoints(side: Side) {
  return Array.from({ length: PER_SIDE }, (_, i) => {
    const wobble = i % 2 === 0 ? -5 : 5;
    const x = side === "left" ? 42 + wobble : 58 - wobble;
    return { x, y: ((i + 0.5) / PER_SIDE) * 1000 };
  });
}

/** Đường dây cong võng từ mép trên đi qua các điểm kẹp, kết thúc ở kẹp cuối */
function stringPath(points: { x: number; y: number }[], side: Side) {
  const top = side === "left" ? 42 : 58;
  const all = [{ x: top, y: 0 }, ...points];
  return all.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = all[i - 1];
    const half = (p.y - prev.y) / 2;
    return `${d} C ${prev.x} ${prev.y + half} ${p.x} ${p.y - half} ${p.x} ${p.y}`;
  }, "");
}

function HeartClip({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 22"
      className="absolute -top-3 left-1/2 z-10 w-7 -translate-x-1/2"
    >
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"
        fill={color}
        stroke={palette.plum}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <div
        className={cn("origin-top", !still && "animate-sway")}
        // Mỗi ảnh đung đưa một nhịp riêng để không đồng loạt như máy
        style={{
          animationDuration: `${3.2 + (index % 3) * 0.7}s`,
          animationDelay: `${-index * 0.9}s`,
        }}
      >
        <HeartClip
          color={index % 2 === 0 ? palette.bubblegum : palette.lilac}
        />
        <div className="ring-plum bg-white p-2.5 pb-9 shadow-[5px_5px_0_var(--plum)] ring-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={img.src}
              alt=""
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
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
        <path
          d={stringPath(points, side)}
          fill="none"
          stroke={palette.plum}
          strokeOpacity={0.55}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
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
 * Hai sợi dây treo ảnh polaroid chạy dọc hai lề (chỉ màn hình ≥1400px),
 * bắt đầu ngay dưới Hero. Ảnh đung đưa nhẹ; cuộn nhanh thì lắc mạnh rồi dừng dần.
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

  if (photos.length < PER_SIDE * 2) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[100svh] bottom-56 -z-[5] hidden min-[1400px]:block"
    >
      <Garland
        side="left"
        items={photos.filter((_, i) => i % 2 === 0).slice(0, PER_SIDE)}
        swing={swing}
        still={still}
      />
      <Garland
        side="right"
        items={photos.filter((_, i) => i % 2 === 1).slice(0, PER_SIDE)}
        swing={swing}
        still={still}
      />
    </div>
  );
}
