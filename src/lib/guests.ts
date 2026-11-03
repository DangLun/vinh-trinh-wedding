import { cacheLife, cacheTag } from "next/cache";
import { wedding } from "@/config/wedding";
import { sampleGuests } from "@/data/guests";
import { callSheet, sheetConfigured } from "@/lib/sheet";
import type { EventId } from "@/types/wedding";
import type { Guest, GuestSide } from "@/types/guest";

const CODE_RE = /^[a-z0-9]{4,8}$/;

// Dữ liệu mẫu do mình gõ tay: sai mã thì báo lỗi ngay lúc build
const seen = new Set<string>();
for (const g of sampleGuests) {
  if (!CODE_RE.test(g.code)) {
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

/** Tag cache của danh sách khách: `updateTag(GUESTS_TAG)` để đọc lại sheet ngay */
export const GUESTS_TAG = "guests";

export type GuestList = {
  guests: Guest[];
  /** Dòng nhập chưa đúng trong sheet, hiện ở trang quản lý: "Dòng 5: …" */
  problems: string[];
  source: "sheet" | "sample";
};

/** Một dòng tab "Khách mời" như Apps Script trả về, chưa kiểm */
type SheetRow = {
  row: number;
  code: string;
  name: string;
  self: string;
  formal: unknown;
  side: string;
  events: string;
  plusOne: string;
  note: string;
};

/**
 * Danh sách khách: đọc tab "Khách mời" trong Google Sheet, chưa nối sheet thì dùng
 * dữ liệu mẫu. Nhớ tạm vài phút (sửa sheet thì khoảng 1 phút sau trang tự thấy),
 * nút "Cập nhật danh sách" ở /quan-ly đọc lại ngay.
 */
export async function getGuestList(): Promise<GuestList> {
  "use cache";
  cacheTag(GUESTS_TAG);
  cacheLife("minutes");
  if (!sheetConfigured()) {
    return { guests: sampleGuests, problems: [], source: "sample" };
  }
  const { rows } = await callSheet<{ rows: SheetRow[] }>("guests.list", {
    events: wedding.events.map((e) => e.title),
  });
  return { ...parseRows(rows), source: "sheet" };
}

export async function getGuests() {
  return (await getGuestList()).guests;
}

export async function findGuest(code: string) {
  return (await getGuests()).find((g) => g.code === code);
}

/** So khớp chữ gõ tay: bỏ dấu, chữ thường, gộp khoảng trắng ("Nhà  Trai" = "nha trai") */
const fold = (s: string) =>
  s
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const sideByName = new Map(
  (Object.entries(sideLabel) as [GuestSide, string][]).map(([id, label]) => [
    fold(label),
    id,
  ]),
);

const ALL_EVENTS = new Set(["", "ca hai", "ca 2", "tat ca"]);

function parseEvents(raw: string): EventId[] | undefined | null {
  if (ALL_EVENTS.has(fold(raw))) return undefined;
  const ids: EventId[] = [];
  for (const part of raw
    .split(/[,;&+]/)
    .map(fold)
    .filter(Boolean)) {
    // "Lễ Vu Quy", "vu quy", "vu-quy" đều được
    const e = wedding.events.find(
      (e) =>
        fold(e.title) === part ||
        fold(e.title).endsWith(` ${part}`) ||
        e.id === part.replace(/ /g, "-"),
    );
    if (!e) return null;
    if (!ids.includes(e.id)) ids.push(e.id);
  }
  return ids.length === wedding.events.length ? undefined : ids;
}

/** Kiểm từng dòng: dòng sai mã thì bỏ, chỗ khác sai thì dùng giá trị mặc định và ghi chú lại */
function parseRows(rows: SheetRow[]) {
  const guests: Guest[] = [];
  const problems: string[] = [];
  const codes = new Set<string>();
  for (const r of rows) {
    const at = `Dòng ${r.row} (${r.name})`;
    if (!CODE_RE.test(r.code)) {
      problems.push(
        r.code
          ? `${at}: mã "${r.code}" phải là 4–8 ký tự a-z, 0-9, đã bỏ qua dòng này.`
          : `${at}: chưa có mã, bấm menu Trang cưới → Tạo mã cho khách mới.`,
      );
      continue;
    }
    if (codes.has(r.code)) {
      problems.push(`${at}: trùng mã "${r.code}" với dòng trên, đã bỏ qua.`);
      continue;
    }
    codes.add(r.code);

    let side = sideByName.get(fold(r.side));
    if (!side) {
      problems.push(
        `${at}: cột Phía phải là Nhà trai, Nhà gái hoặc Bạn bè, tạm xếp vào Bạn bè.`,
      );
      side = "ban-be";
    }

    let events = parseEvents(r.events);
    if (events === null) {
      problems.push(`${at}: không hiểu lễ "${r.events}", tạm mời tất cả.`);
      events = undefined;
    }

    let self = r.self;
    if (!self) {
      problems.push(`${at}: thiếu Tự xưng, tạm dùng "tụi em".`);
      self = "tụi em";
    }

    guests.push({
      code: r.code,
      name: r.name,
      self,
      formal:
        r.formal === true ||
        ["x", "co", "true"].includes(fold(String(r.formal))),
      side,
      ...(events && { events }),
      ...(r.plusOne && { plusOne: r.plusOne }),
      ...(r.note && { note: r.note }),
    });
  }
  return { guests, problems };
}

export const invitePath = (g: Guest) => `/m/${g.code}`;

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
