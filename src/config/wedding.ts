import type { WeddingConfig } from "@/types/wedding";

// Toàn bộ thông tin đám cưới — sửa ở đây, cả trang tự cập nhật.
export const wedding: WeddingConfig = {
  groom: { name: "Vinh", fullName: "Nguyễn Văn Vinh" },
  bride: { name: "Trinh", fullName: "Trần Thị Trinh" },
  hashtag: "#VinhTrinhForever",
  marquee: ["TEAM INH INH", "SAVE THE DATE", "VINH ♥ TRINH"],
  // ISO 8601, giờ Việt Nam
  date: "2026-12-20T11:00:00+07:00",
  events: [
    {
      title: "Lễ Vu Quy",
      time: "2026-12-20T08:00:00+07:00",
      place: "Tư gia nhà gái",
      address: "Địa chỉ nhà gái",
      mapUrl: "https://maps.google.com/?q=",
    },
    {
      title: "Tiệc Cưới",
      time: "2026-12-20T11:00:00+07:00",
      place: "Trung tâm tiệc cưới",
      address: "Địa chỉ nhà hàng",
      mapUrl: "https://maps.google.com/?q=",
    },
  ],
  loveStory: [
    { date: "2020", title: "Lần đầu gặp nhau", text: "Kể chuyện ở đây..." },
    { date: "2022", title: "Chính thức hẹn hò", text: "Kể chuyện ở đây..." },
    { date: "2026", title: "Cầu hôn", text: "Kể chuyện ở đây..." },
  ],
  // Đặt ảnh vào public/images/gallery rồi khai báo tại đây
  gallery: [],
  music: "/music/bg.mp3",
};

/** "Vinh & Trinh" */
export const coupleName = `${wedding.groom.name} & ${wedding.bride.name}`;
