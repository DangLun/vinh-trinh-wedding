import { sampleStory } from "@/data/sample-story";
import { sampleGallery } from "@/data/sample-gallery";
import type { WeddingConfig } from "@/types/wedding";

// Toàn bộ thông tin đám cưới — sửa ở đây, cả trang tự cập nhật.
export const wedding: WeddingConfig = {
  groom: { name: "Vinh", fullName: "Thành Vinh", rank: "Trưởng Nam" },
  bride: { name: "Trinh", fullName: "Lê Thị Tố Trinh", rank: "Trưởng Nữ" },
  // DỮ LIỆU MẪU: tên phụ huynh, địa chỉ và thứ bậc ở trên in lên mặt trong thiệp mời
  families: {
    bride: {
      parents: ["Ông Trần Văn Phúc", "Bà Lê Thị Hạnh"],
      address: "Xã Mỹ Khánh, TP. Cần Thơ",
    },
    groom: {
      parents: ["Ông Nguyễn Văn Lộc", "Bà Phạm Thị Thu"],
      address: "Phường Tân An, TP. Cần Thơ",
    },
  },
  hashtag: "#VinhTrinhForever",
  marquee: [
    "Trinh & Vinh",
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

/** Thứ tự hiển thị tên cặp đôi: cô dâu trước, chú rể sau */
export const couple = [wedding.bride, wedding.groom] as const;

/** "Trinh & Vinh" */
export const coupleName = `${couple[0].name} & ${couple[1].name}`;

/** Năm âm lịch của đám cưới (Tết Đinh Mùi là 6/2/2027) */
export const lunarYearName = "Đinh Mùi";
export const lunarYear = `Xuân ${lunarYearName}`;

/** Ngày âm lịch của một mốc giờ, lấy từ lễ trùng thời điểm đó */
export const lunarOf = (iso: string) =>
  wedding.events.find((e) => e.time === iso)?.lunar;
