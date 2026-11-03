"use server";

import { headers } from "next/headers";
import { coupleName } from "@/config/wedding";
import { findGuest, inviteeLabel } from "@/lib/guests";
import { callSheet, sheetConfigured } from "@/lib/sheet";

export type WishState =
  | { status: "idle" }
  /** `id` khác nhau mỗi lần gửi, để giao diện biết có lời chúc mới */
  | { status: "sent"; id: number; name: string }
  | { status: "error"; error: string };

const NAME_MAX = 60;
const MESSAGE_MAX = 1000;

// Chặn gửi dồn dập từ một địa chỉ (chống spam đơn giản; mỗi máy chủ đếm riêng)
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function tooMany(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > LIMIT;
}

/**
 * Lời chúc, chỉ ghi vào tab "Lời chúc" của Google Sheet (không hiện lên trang).
 * `code` gắn sẵn ở server: có thì là khách từ link riêng, lấy tên theo danh sách;
 * null là trang chung, khách tự gõ tên.
 */
export async function sendWish(
  code: string | null,
  _prev: WishState,
  formData: FormData,
): Promise<WishState> {
  // Ô bẫy ẩn: người thật không thấy để điền, bot điền thì giả vờ đã nhận
  if (formData.get("website")) {
    return {
      status: "sent",
      id: Date.now(),
      name: String(formData.get("name") ?? "").trim(),
    };
  }

  const guest = code ? await findGuest(code) : undefined;
  if (code && !guest) return { status: "error", error: "Link mời không đúng." };
  const name = guest
    ? inviteeLabel(guest)
    : String(formData.get("name") ?? "")
        .trim()
        .slice(0, NAME_MAX);
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, MESSAGE_MAX);
  if (!name) {
    return { status: "error", error: `Cho ${coupleName} biết tên bạn nha.` };
  }
  if (!message) {
    return { status: "error", error: "Viết vài chữ chúc mừng nha." };
  }

  if (!sheetConfigured()) {
    return {
      status: "error",
      error:
        "Chưa nối Google Sheet (SHEET_SCRIPT_URL, SHEET_SECRET), xem docs/google-sheets.md.",
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip");
  if (ip && tooMany(ip)) {
    return {
      status: "error",
      error: "Gửi nhiều quá rồi, nghỉ tay vài phút rồi gửi tiếp nha.",
    };
  }

  try {
    await callSheet("wish.add", {
      wish: { name, message, code: guest?.code ?? "" },
    });
  } catch (err) {
    console.error("[wish]", err);
    return {
      status: "error",
      error: "Chưa gửi được, mạng chập chờn. Thử lại giúp nha.",
    };
  }
  return { status: "sent", id: Date.now(), name };
}
