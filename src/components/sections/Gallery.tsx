import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";
import { AutoplayVideo } from "./AutoplayVideo";
import type { GalleryItem } from "@/types/wedding";

const tile = "mb-4 w-full break-inside-avoid rounded-xl";

function GalleryTile({ item }: { item: GalleryItem }) {
  if (item.type === "video") {
    // Chỉ phát khi trong màn hình (AutoplayVideo); aspect-ratio giữ chỗ để không nhảy layout.
    // Người bật giảm chuyển động thấy ảnh poster thay vì video tự chạy.
    return (
      <>
        <AutoplayVideo
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
          width={item.width}
          height={item.height}
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
          className={`${tile} h-auto object-cover motion-reduce:hidden`}
          preload="metadata"
        />
        <Image
          src={item.poster}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(min-width: 640px) 33vw, 50vw"
          className={`${tile} hidden motion-reduce:block`}
        />
      </>
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes="(min-width: 640px) 33vw, 50vw"
      className={tile}
    />
  );
}

// TODO: bento/polaroid layout + PhotoSwipe lightbox
export default function Gallery() {
  return (
    <Section width="lg">
      <SectionHeading>Album</SectionHeading>
      {wedding.gallery.length === 0 ? (
        <p className="opacity-60">
          Thêm ảnh vào public/images/gallery và khai báo trong
          src/config/wedding.ts
        </p>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3">
          {wedding.gallery.map((item) => (
            <GalleryTile key={item.src} item={item} />
          ))}
        </div>
      )}
    </Section>
  );
}
