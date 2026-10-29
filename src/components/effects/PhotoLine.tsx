import {
  garlandPhotos,
  HangingPolaroid,
  Thread,
} from "@/components/ui/Garland";
import { MaiFlower } from "@/components/ui/MaiFlower";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/wedding";

// Mỗi ô là một nhịp dây võng (viewBox 100×40): hai đầu cao ở y=4, giữa võng xuống y=20 nơi kẹp ảnh
const SAG = "M 0 4 Q 50 36 100 4";

// Lặp ảnh trong một dải đủ dài để phủ kín cả màn tablet (dải luôn rộng hơn màn hình)
const REPEAT = 2;

function Tile({ img, index }: { img: GalleryImage; index: number }) {
  return (
    <li className="relative w-40 shrink-0 sm:w-52">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-10 w-full overflow-visible"
      >
        <Thread d={SAG} />
      </svg>
      {/* Bông mai kết ở chỗ nối hai nhịp dây */}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "absolute top-1 left-0 -translate-1/2",
          index % 2 === 0 ? "size-7" : "size-5",
        )}
        style={{ rotate: `${index * 41}deg` }}
      >
        <MaiFlower />
      </svg>
      <div
        className="mx-auto w-28 pt-5 sm:w-36"
        style={{ rotate: `${index % 2 === 0 ? -4 : 3}deg` }}
      >
        <HangingPolaroid
          img={img}
          index={index}
          sizes="(min-width: 640px) 144px, 112px"
        />
      </div>
    </li>
  );
}

function Track({
  items,
  reverse,
}: {
  items: GalleryImage[];
  reverse?: boolean;
}) {
  const tiles = Array.from({ length: REPEAT }, () => items).flat();
  return (
    <ul
      className="animate-marquee flex shrink-0 motion-reduce:animate-none"
      style={{
        animationDuration: "60s",
        animationDirection: reverse ? "reverse" : undefined,
      }}
    >
      {tiles.map((img, i) => (
        <Tile key={i} img={img} index={i} />
      ))}
    </ul>
  );
}

/**
 * Dây tơ hồng nằm ngang treo ảnh polaroid, trôi chậm sang ngang (bản cho màn hẹp hơn 1400px,
 * nơi không có lề để treo dây dọc như HangingPhotos). `line` chọn dây thứ nhất hay thứ hai;
 * dây thứ hai trôi ngược chiều.
 */
export default function PhotoLine({ line }: { line: 0 | 1 }) {
  if (!garlandPhotos) return null;
  const items = garlandPhotos[line];
  return (
    <div
      aria-hidden
      className="pointer-events-none flex overflow-hidden py-6 min-[1400px]:hidden"
    >
      <Track items={items} reverse={line === 1} />
      <Track items={items} reverse={line === 1} />
    </div>
  );
}
