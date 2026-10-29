import { wedding } from "@/config/wedding";
import { guests } from "@/data/guests";
import type { Guest, GuestSide } from "@/types/guest";

// Chặn lỗi gõ trùng mã ngay lúc build: hai khách trùng mã sẽ dùng chung một link
const seen = new Set<string>();
for (const g of guests) {
  if (!/^[a-z0-9]{4,8}$/.test(g.code)) {
    throw new Error(
      `Mã khách "${g.code}" (${g.name}) phải là 4–8 ký tự a-z, 0-9`,
    );
  }
  if (seen.has(g.code)) {
    throw new Error(`Trùng mã khách "${g.code}" (${g.name})`);
  }
  seen.add(g.code);
}

export const sideLabel: Record<GuestSide, string> = {
  "nha-trai": "Nhà trai",
  "nha-gai": "Nhà gái",
  "ban-be": "Bạn bè",
};

export const invitePath = (g: Guest) => `/m/${g.code}`;

export function findGuest(code: string) {
  return guests.find((g) => g.code === code);
}

/** "Anh Tuấn và người thương" */
export function inviteeLabel(g: Guest) {
  return g.plusOne ? `${g.name} và ${g.plusOne}` : g.name;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Tụi con trân trọng kính mời" / "Tụi mình mời" */
export function inviteVerb(g: Guest) {
  return `${capitalize(g.self)} ${g.formal ? "trân trọng kính mời" : "mời"}`;
}

/** Các lễ khách này được mời, theo thứ tự thời gian trong cấu hình */
export function guestEvents(g?: Guest) {
  if (!g?.events) return wedding.events;
  return wedding.events.filter((e) => g.events!.includes(e.id));
}
