import type { GalleryItem } from "@/types/wedding";

/**
 * DỮ LIỆU MẪU để test giao diện và animation — thay bằng ảnh cưới thật trước khi ra mắt.
 * Ảnh: Unsplash qua picsum.photos (giấy phép Unsplash, dùng tự do). Tác giả ghi trong
 * public/images/gallery/sample/CREDITS.md. Video: tự dựng từ chính các ảnh này.
 * Xoá: bỏ import trong src/config/wedding.ts, xoá file này và 2 thư mục sample/.
 */
export const sampleGallery: GalleryItem[] = [
  {
    type: "image",
    src: "/images/gallery/sample/01.webp",
    alt: "Hai người ngồi ngắm hoàng hôn",
    width: 1200,
    height: 800,
  },
  {
    type: "image",
    src: "/images/gallery/sample/02.webp",
    alt: "Tóc bay trong nắng chiều",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/03.webp",
    alt: "Pháo sáng đêm tiệc",
    width: 900,
    height: 1200,
  },
  {
    type: "video",
    src: "/videos/sample/clip-portrait.mp4",
    poster: "/videos/sample/clip-portrait-poster.webp",
    alt: "Clip save the date dạng dọc",
    width: 720,
    height: 1280,
  },
  {
    type: "image",
    src: "/images/gallery/sample/04.webp",
    alt: "Cành hoa mùa xuân",
    width: 1000,
    height: 1000,
  },
  {
    type: "image",
    src: "/images/gallery/sample/05.webp",
    alt: "Đèn sân khấu và khách dự tiệc",
    width: 1200,
    height: 800,
  },
  {
    type: "image",
    src: "/images/gallery/sample/06.webp",
    alt: "Chân dung ngày nắng",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/07.webp",
    alt: "Hoa anh đào hồng",
    width: 1000,
    height: 1000,
  },
  {
    type: "image",
    src: "/images/gallery/sample/08.webp",
    alt: "Cầu tàu bên biển",
    width: 1200,
    height: 800,
  },
  {
    type: "image",
    src: "/images/gallery/sample/09.webp",
    alt: "Đoá hoa hồng cam",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/10.webp",
    alt: "Váy trắng giữa rừng",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/11.webp",
    alt: "Hoa tím nhỏ",
    width: 1000,
    height: 1000,
  },
  {
    type: "video",
    src: "/videos/sample/clip-landscape.mp4",
    poster: "/videos/sample/clip-landscape-poster.webp",
    alt: "Clip Team Inh Inh dạng ngang",
    width: 1280,
    height: 720,
  },
  {
    type: "image",
    src: "/images/gallery/sample/12.webp",
    alt: "Chuyến đi bằng xe van",
    width: 1200,
    height: 800,
  },
  {
    type: "image",
    src: "/images/gallery/sample/13.webp",
    alt: "Ánh nắng ngược sáng",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/14.webp",
    alt: "Quả mâm xôi trong nắng",
    width: 1200,
    height: 800,
  },
  {
    type: "image",
    src: "/images/gallery/sample/15.webp",
    alt: "Đứng nhìn hồ núi",
    width: 900,
    height: 1200,
  },
  {
    type: "image",
    src: "/images/gallery/sample/16.webp",
    alt: "Hoa đỏ dưới trời xanh",
    width: 1000,
    height: 1000,
  },
  {
    type: "image",
    src: "/images/gallery/sample/17.webp",
    alt: "Tô salad nhiều màu",
    width: 1000,
    height: 1000,
  },
  {
    type: "image",
    src: "/images/gallery/sample/18.webp",
    alt: "Đồi cỏ xanh",
    width: 1200,
    height: 800,
  },
];
