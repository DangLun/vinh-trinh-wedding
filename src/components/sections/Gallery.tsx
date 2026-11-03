import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { AutoplayVideo } from "./AutoplayVideo";
import { GalleryLightbox } from "./GalleryLightbox";
import { GalleryReveal } from "./GalleryReveal";
import type { GalleryItem } from "@/types/wedding";

// Ảnh phủ kín lớp parallax của GalleryReveal (lớp này cao hơn khung để trôi không lộ mép)
const fill = "size-full object-cover";
const sizes = "(min-width: 640px) 33vw, 50vw";

function GalleryMedia({ item }: { item: GalleryItem }) {
  if (item.type === "video") {
    // Chỉ phát khi trong màn hình (AutoplayVideo).
    // Người bật giảm chuyển động thấy ảnh poster thay vì video tự chạy.
    return (
      <>
        <AutoplayVideo
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
          className={`${fill} motion-reduce:hidden`}
          preload="metadata"
        />
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          sizes={sizes}
          className="hidden object-cover motion-reduce:block"
        />
      </>
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

// Ảnh xem lớn lấy qua bộ tối ưu ảnh của Next (các cỡ phải nằm trong deviceSizes mặc định),
// máy tự chọn cỡ hợp màn hình; ảnh gốc nhỏ hơn thì Next trả nguyên cỡ gốc, không phóng to
const LARGE_WIDTHS = [1080, 1920, 3840];
const optimized = (src: string, w: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

/** Thuộc tính cho PhotoSwipe (GalleryLightbox) đọc khi bấm vào một mục */
function lightboxProps(item: GalleryItem) {
  const size = {
    "data-pswp-width": item.width,
    "data-pswp-height": item.height,
  };
  if (item.type === "video") {
    return { ...size, "data-pswp-type": "video", "data-poster": item.poster };
  }
  return {
    ...size,
    "data-pswp-src": optimized(item.src, 1920),
    "data-pswp-srcset": LARGE_WIDTHS.map(
      (w) => `${optimized(item.src, w)} ${w}w`,
    ).join(", "),
  };
}

export default function Gallery() {
  return (
    <Section width="lg">
      <SectionHeading className="text-center">Album</SectionHeading>
      {wedding.gallery.length === 0 ? (
        <p className="opacity-60">
          Thêm ảnh vào public/images/gallery và khai báo trong
          src/config/wedding.ts
        </p>
      ) : (
        <GalleryLightbox className="columns-2 gap-5 sm:columns-3 sm:gap-8">
          {wedding.gallery.map((item, i) => (
            // Không có JavaScript thì link vẫn mở thẳng file ảnh/video
            <a
              key={item.src}
              href={item.src}
              {...lightboxProps(item)}
              className="focus-visible:outline-gold mb-5 block break-inside-avoid focus-visible:outline-1 focus-visible:outline-offset-4 sm:mb-8"
            >
              <GalleryReveal
                ratio={`${item.width} / ${item.height}`}
                order={i % 3}
              >
                <GalleryMedia item={item} />
              </GalleryReveal>
              <span className="sr-only">
                {item.type === "video" ? "Xem video lớn" : "Xem ảnh lớn"}
              </span>
            </a>
          ))}
        </GalleryLightbox>
      )}
    </Section>
  );
}
