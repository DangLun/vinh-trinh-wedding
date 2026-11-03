import type { Guest } from "@/types/guest";

/**
 * DỮ LIỆU MẪU để thử giao diện khi chưa nối Google Sheet (SHEET_SCRIPT_URL).
 * Danh sách khách thật nhập ở tab "Khách mời" trong Google Sheet, xem docs/google-sheets.md.
 * Mã: 4–8 ký tự chữ thường + số, không được trùng (build sẽ báo lỗi).
 */
export const sampleGuests: Guest[] = [
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
