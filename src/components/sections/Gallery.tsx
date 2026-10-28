import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { wedding } from "@/config/wedding";

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
          {wedding.gallery.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="mb-4 rounded-xl"
            />
          ))}
        </div>
      )}
    </Section>
  );
}
