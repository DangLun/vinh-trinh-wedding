import type { Guest } from "@/types/guest";

/**
 * Danh sách khách mời. Mỗi khách có link riêng: vinhtrinh.love/m/<code>.
 * Mã: 5 ký tự chữ thường + số, tự nghĩ ngẫu nhiên cho khó đoán, không được trùng (build sẽ báo lỗi).
 * Đang là DỮ LIỆU MẪU để thử giao diện, thay bằng khách thật.
 */
export const guests: Guest[] = [
  {
    code: "t7k2q",
    name: "Anh Tuấn",
    self: "tụi em",
    side: "ban-be",
    plusOne: "người thương",
    note: "Nhớ dẫn chị Hằng theo nha, tụi em giữ sẵn bàn đẹp rồi!",
  },
  {
    code: "c3b9x",
    name: "Cô Ba",
    self: "tụi con",
    formal: true,
    side: "nha-gai",
    events: ["vu-quy"],
    plusOne: "gia đình",
  },
  {
    code: "h2v6r",
    name: "Bác Hai",
    self: "tụi cháu",
    formal: true,
    side: "nha-trai",
    events: ["tan-hon"],
  },
  {
    code: "m8n4p",
    name: "Minh",
    self: "tụi mình",
    side: "ban-be",
    note: "Team Inh Inh tập hợp! Vắng là bị trừ điểm đó nha.",
  },
  {
    code: "l5d8w",
    name: "Chị Lan",
    self: "tụi em",
    side: "nha-gai",
    events: ["vu-quy"],
    plusOne: "anh Khoa",
  },
  {
    code: "q9w3e",
    name: "Thầy Phúc",
    self: "tụi em",
    formal: true,
    side: "nha-trai",
    events: ["tan-hon"],
    note: "Tụi em mong được thầy đến chứng kiến ngày vui.",
  },
];
