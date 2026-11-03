// Chỉ dùng ở server: hồi âm (RSVP) ghi vào tab "Hồi âm" của Google Sheet (xem src/lib/sheet.ts).
import { callSheet } from "@/lib/sheet";

/** Một câu trả lời gửi vào sheet; `events` là tên lễ, để đọc thẳng trong sheet */
export type RsvpAnswer = {
  code: string;
  name: string;
  side: string;
  attending: boolean;
  events: string[];
};

/** Một dòng đọc lại từ sheet */
export type RsvpRow = {
  code: string;
  attending: boolean;
  events: string;
  updatedAt: string;
};

export async function saveRsvp(answer: RsvpAnswer) {
  await callSheet("rsvp.save", { answer });
}

/** Mọi hồi âm, theo mã khách */
export async function listRsvps() {
  const { rows } = await callSheet<{ rows: RsvpRow[] }>("rsvp.list");
  return new Map(rows.map((r) => [r.code, r]));
}
