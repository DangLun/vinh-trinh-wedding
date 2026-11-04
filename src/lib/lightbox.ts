// Thuộc tính PhotoSwipe (components/ui/Lightbox) đọc từ thẻ <a> khi khách bấm vào ảnh.

// Ảnh xem lớn lấy qua bộ tối ưu ảnh của Next (các cỡ phải nằm trong deviceSizes mặc định),
// máy tự chọn cỡ hợp màn hình; ảnh gốc nhỏ hơn thì Next trả nguyên cỡ gốc, không phóng to
const LARGE_WIDTHS = [1080, 1920, 3840];
const optimized = (src: string, w: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

/** Không có JavaScript thì `href` vẫn mở thẳng file ảnh */
export function lightboxImage(image: {
  src: string;
  width: number;
  height: number;
}) {
  return {
    href: image.src,
    "data-pswp-width": image.width,
    "data-pswp-height": image.height,
    "data-pswp-src": optimized(image.src, 1920),
    "data-pswp-srcset": LARGE_WIDTHS.map(
      (w) => `${optimized(image.src, w)} ${w}w`,
    ).join(", "),
    // Khung có thể cắt ảnh (object-cover): hiệu ứng phóng ra tính theo phần ảnh đang thấy
    "data-cropped": true,
  };
}

/** Viền báo đang chọn bằng bàn phím, cho thẻ <a> bọc ảnh */
export const LIGHTBOX_FOCUS =
  "focus-visible:outline-gold focus-visible:outline-1 focus-visible:outline-offset-4";
