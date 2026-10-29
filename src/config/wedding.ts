import { sampleStory } from "@/data/sample-story";
import { sampleGallery } from "@/data/sample-gallery";
import type { WeddingConfig } from "@/types/wedding";

// Toàn bộ thông tin đám cưới — sửa ở đây, cả trang tự cập nhật.
export const wedding: WeddingConfig = {
  groom: { name: "Vinh", fullName: "Nguyễn Văn Vinh" },
  bride: { name: "Trinh", fullName: "Trần Thị Trinh" },
  hashtag: "#VinhTrinhForever",
  marquee: [
    "Vinh & Trinh",
    "Xuân Đinh Mùi",
    "Lễ Vu Quy",
    "Lễ Tân Hôn",
    "Mười bốn tháng Hai",
  ],
  // Đang dùng ảnh mẫu trong album, thay bằng ảnh cưới thật (ảnh dọc, khoảng 3:4)
  heroImage: {
    src: "/images/gallery/sample/02.webp",
    alt: "Cô dâu trong nắng chiều",
  },
  // ISO 8601, giờ Việt Nam
  date: "2027-02-14T08:00:00+07:00",
  events: [
    {
      id: "vu-quy",
      title: "Lễ Vu Quy",
      time: "2027-02-13T08:00:00+07:00",
      lunar: "Mùng 8 tháng Giêng",
      place: "Tư gia nhà gái",
      address: "Địa chỉ nhà gái",
      mapUrl: "https://maps.google.com/?q=",
    },
    {
      id: "tan-hon",
      title: "Lễ Tân Hôn",
      time: "2027-02-14T08:00:00+07:00",
      lunar: "Mùng 9 tháng Giêng",
      place: "Tư gia nhà trai",
      address: "Địa chỉ nhà trai",
      mapUrl: "https://maps.google.com/?q=",
    },
  ],
  // Đang dùng dữ liệu mẫu (src/data/sample-story.ts) để thử giao diện, thay bằng chuyện thật.
  loveStory: sampleStory,
  // Đặt ảnh vào public/images/gallery rồi khai báo tại đây.
  // Đang dùng dữ liệu mẫu (src/data/sample-gallery.ts) để test giao diện.
  gallery: sampleGallery,
  music: "/music/bg.mp3",
};

/** "Vinh & Trinh" */
export const coupleName = `${wedding.groom.name} & ${wedding.bride.name}`;

/** Năm âm lịch của đám cưới (Tết Đinh Mùi là 6/2/2027) */
export const lunarYear = "Xuân Đinh Mùi";

/** Ngày âm lịch của một mốc giờ, lấy từ lễ trùng thời điểm đó */
export const lunarOf = (iso: string) =>
  wedding.events.find((e) => e.time === iso)?.lunar;
