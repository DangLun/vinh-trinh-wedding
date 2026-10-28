export type GuestGroup = "nha-trai" | "nha-gai" | "ban-be" | "dong-nghiep";

export type Guest = {
  /** Dùng cho link mời riêng: /moi/<slug> */
  slug: string;
  /** Tên hiển thị: "Anh Tuấn", "Gia đình chị Lan" */
  name: string;
  group?: GuestGroup;
};
