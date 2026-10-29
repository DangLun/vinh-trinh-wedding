import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { AutoplayVideo } from "./AutoplayVideo";
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

// TODO: PhotoSwipe lightbox
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
        <div className="columns-2 gap-5 sm:columns-3 sm:gap-8">
          {wedding.gallery.map((item, i) => (
            <GalleryReveal
              key={item.src}
              ratio={`${item.width} / ${item.height}`}
              order={i % 3}
            >
              <GalleryMedia item={item} />
            </GalleryReveal>
          ))}
        </div>
      )}
    </Section>
  );
}
