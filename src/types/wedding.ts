export type Person = {
  /** Tên gọi ngắn hiển thị ở Hero, tiêu đề trang */
  name: string;
  fullName: string;
};

export type WeddingEvent = {
  title: string;
  /** ISO 8601, kèm múi giờ (+07:00) */
  time: string;
  /** Giờ kết thúc (ISO 8601) — dùng cho "Lưu vào lịch"; bỏ trống thì tính 2 tiếng */
  endTime?: string;
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
  hashtag: string;
  marquee: string[];
  /** Thời điểm chính (tiệc cưới), ISO 8601 kèm múi giờ — dùng cho Hero và đếm ngược */
  date: string;
  events: WeddingEvent[];
  loveStory: StoryMilestone[];
  gallery: GalleryItem[];
  music: string;
};
