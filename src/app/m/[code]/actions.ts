"use server";

import { findGuest, guestEvents, inviteeLabel, sideLabel } from "@/lib/guests";
import { saveRsvp } from "@/lib/rsvp";
import { sheetConfigured } from "@/lib/sheet";

export type RsvpState =
  | { status: "idle" }
  | { status: "saved"; attending: boolean }
  | { status: "error"; error: string };

/**
 * Nhận hồi âm từ link mời riêng. `code` được gắn sẵn ở server (bind), mọi giới hạn
 * (lễ được mời) kiểm lại theo danh sách khách ở server, không tin dữ liệu từ form.
 */
export async function submitRsvp(
  code: string,
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const guest = await findGuest(code);
  if (!guest) return { status: "error", error: "Link mời không đúng." };
  if (!sheetConfigured()) {
    return {
      status: "error",
      error:
        "Chưa nối Google Sheet (SHEET_SCRIPT_URL, SHEET_SECRET), xem docs/google-sheets.md.",
    };
  }

  const attendingRaw = formData.get("attending");
  if (attendingRaw !== "yes" && attendingRaw !== "no") {
    return { status: "error", error: "Chọn giúp có đến được không nha." };
  }
  const attending = attendingRaw === "yes";

  const invited = guestEvents(guest);
  // Mời một lễ thì không có ô chọn lễ: coi như đi lễ đó
  const picked =
    invited.length === 1
      ? invited
      : invited.filter((e) => formData.getAll("events").includes(e.id));
  if (attending && picked.length === 0) {
    return { status: "error", error: "Chọn giúp lễ sẽ đến nha." };
  }

  try {
    await saveRsvp({
      code: guest.code,
      name: inviteeLabel(guest),
      side: sideLabel[guest.side],
      attending,
      events: attending ? picked.map((e) => e.title) : [],
    });
  } catch (err) {
    console.error("[rsvp]", err);
    return {
      status: "error",
      error: "Chưa gửi được, mạng chập chờn. Thử lại giúp nha.",
    };
  }
  return { status: "saved", attending };
}
