import { sampleStory } from "@/data/sample-story";
import { sampleGallery } from "@/data/sample-gallery";
import type { WeddingConfig } from "@/types/wedding";

// Toàn bộ thông tin đám cưới — sửa ở đây, cả trang tự cập nhật.
export const wedding: WeddingConfig = {
  groom: { name: "Vinh", fullName: "Nguyễn Văn Vinh" },
  bride: { name: "Trinh", fullName: "Trần Thị Trinh" },
  hashtag: "#VinhTrinhForever",
  marquee: ["TEAM INH INH", "VALENTINE", "VINH ♥ TRINH", "CƯỚI ĐẦU XUÂN"],
  // ISO 8601, giờ Việt Nam
  date: "2027-02-14T08:00:00+07:00",
  events: [
    {
      title: "Lễ Vu Quy",
      time: "2027-02-13T08:00:00+07:00",
      place: "Tư gia nhà gái",
      address: "Địa chỉ nhà gái",
      mapUrl: "https://maps.google.com/?q=",
    },
    {
      title: "Lễ Tân Hôn",
      time: "2027-02-14T08:00:00+07:00",
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
