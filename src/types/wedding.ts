export type Person = {
  /** Tên gọi ngắn hiển thị ở Hero, tiêu đề trang */
  name: string;
  fullName: string;
};

export type WeddingEvent = {
  title: string;
  /** ISO 8601, kèm múi giờ (+07:00) */
  time: string;
  place: string;
  address: string;
  mapUrl: string;
};

export type StoryMilestone = {
  date: string;
  title: string;
  text: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type WeddingConfig = {
  groom: Person;
  bride: Person;
  hashtag: string;
  marquee: string[];
  /** Thời điểm chính (tiệc cưới), ISO 8601 kèm múi giờ — dùng cho Hero và đếm ngược */
  date: string;
  events: WeddingEvent[];
  loveStory: StoryMilestone[];
  gallery: GalleryImage[];
  music: string;
};
