export type Person = {
  /** Tên gọi ngắn hiển thị ở Hero, tiêu đề trang */
  name: string;
  fullName: string;
  /** Thứ bậc trong nhà, in dưới tên trên thiệp: "Trưởng Nữ", "Út Nam"… */
  rank: string;
};

/** Một họ đứng tên trên thiệp (nhà trai / nhà gái) */
export type Family = {
  /** Phụ huynh đứng tên, theo thứ tự in trên thiệp: "Ông Trần Văn A", "Bà Lê Thị B" */
  parents: string[];
  address: string;
};

/** Mã lễ, dùng để chọn khách được mời dự lễ nào (Guest.events) */
export type EventId = "vu-quy" | "tan-hon";

export type WeddingEvent = {
  id: EventId;
  title: string;
  /** ISO 8601, kèm múi giờ (+07:00) */
  time: string;
  /** Giờ kết thúc (ISO 8601) — dùng cho "Lưu vào lịch"; bỏ trống thì tính 2 tiếng */
  endTime?: string;
  /** Ngày âm lịch hiện dưới ngày dương: "Mùng 9 tháng Giêng" */
  lunar?: string;
  place: string;
  address: string;
  mapUrl: string;
};

export type StoryMilestone = {
  date: string;
  title: string;
  text: string;
  /** Ảnh kỷ niệm của mốc (không bắt buộc), đặt trong public/images */
  image?: { src: string; alt: string };
};

type GalleryMediaBase = {
  src: string;
  alt: string;
  /** Kích thước gốc — dùng để giữ tỉ lệ khung, tránh nhảy layout */
  width: number;
  height: number;
};

export type GalleryImage = GalleryMediaBase & { type: "image" };

export type GalleryVideo = GalleryMediaBase & {
  type: "video";
  /** Ảnh hiện trong lúc video đang tải */
  poster: string;
};

export type GalleryItem = GalleryImage | GalleryVideo;

export type WeddingConfig = {
  groom: Person;
  bride: Person;
  families: { groom: Family; bride: Family };
  hashtag: string;
  marquee: string[];
  /** Ảnh chân dung trong khung vòm ở Hero (ảnh dọc, khoảng 3:4) */
  heroImage: { src: string; alt: string };
  /** Thời điểm chính (tiệc cưới), ISO 8601 kèm múi giờ — dùng cho Hero và đếm ngược */
  date: string;
  events: WeddingEvent[];
  loveStory: StoryMilestone[];
  gallery: GalleryItem[];
  music: string;
};
