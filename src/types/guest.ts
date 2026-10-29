import type { EventId } from "./wedding";

export type GuestSide = "nha-trai" | "nha-gai" | "ban-be";

export type Guest = {
  /** Mã trong link mời riêng: vinhtrinh.love/m/<code>. 5 ký tự chữ thường + số, không trùng nhau */
  code: string;
  /** Tên kèm danh xưng, đúng như muốn hiện trên thiệp: "Anh Tuấn", "Cô Ba", "Minh" */
  name: string;
  /** Cô dâu chú rể tự xưng với khách này: "tụi em", "tụi con", "tụi cháu", "tụi mình" */
  self: string;
  /** true: lời mời trang trọng ("trân trọng kính mời") cho người lớn; mặc định thân mật */
  formal?: boolean;
  side: GuestSide;
  /** Các lễ được mời; bỏ trống = mời tất cả */
  events?: EventId[];
  /** Người đi cùng, ghép sau tên: "người thương" → "Anh Tuấn và người thương" */
  plusOne?: string;
  /** Lời nhắn riêng hiện trong thiệp */
  note?: string;
};
