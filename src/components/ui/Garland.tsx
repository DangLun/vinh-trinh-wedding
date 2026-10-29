import Image from "next/image";
import { palette } from "@/config/theme";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/wedding";

/** Số ảnh trên mỗi dây */
export const PHOTOS_PER_LINE = 5;

const images = wedding.gallery.filter(
  (item): item is GalleryImage => item.type === "image",
);

/** Ảnh cho 2 dây (chẵn / lẻ xen kẽ để hai dây không trùng ảnh); null nếu album chưa đủ ảnh */
export const garlandPhotos: [GalleryImage[], GalleryImage[]] | null =
  images.length < PHOTOS_PER_LINE * 2
    ? null
    : [
        images.filter((_, i) => i % 2 === 0).slice(0, PHOTOS_PER_LINE),
        images.filter((_, i) => i % 2 === 1).slice(0, PHOTOS_PER_LINE),
      ];

/** Sợi tơ hồng: chỉ đỏ lì xì + nét đứt hồng nhạt chồng lên cho ra vẻ xoắn. Đặt trong <svg>. */
export function Thread({ d }: { d: string }) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={palette.lixi}
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke={palette.blush}
        strokeWidth={3}
        strokeDasharray="2 5"
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
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

/**
 * Ảnh polaroid kẹp tim, tự đung đưa quanh mép trên (tắt khi `still`).
 * Bề rộng do phần tử cha quyết định.
 */
export function HangingPolaroid({
  img,
  index,
  sizes,
  still,
  className,
}: {
  img: GalleryImage;
  index: number;
  sizes: string;
  still?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("origin-top", !still && "animate-sway", className)}
      // Mỗi ảnh đung đưa một nhịp riêng để không đồng loạt như máy
      style={{
        animationDuration: `${3.2 + (index % 3) * 0.7}s`,
        animationDelay: `${-index * 0.9}s`,
      }}
    >
      <HeartClip color={index % 2 === 0 ? palette.bubblegum : palette.lixi} />
      <div className="ring-plum bg-white p-[4%] pb-[14%] shadow-[4px_4px_0_var(--plum)] ring-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={img.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
