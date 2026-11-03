import { coupleName, wedding } from "@/config/wedding";
import { findGuest, getGuests, guestEvents, inviteeLabel } from "@/lib/guests";
import { inviteCard, ogSize } from "@/lib/og";

export const alt = `Thiệp mời đám cưới ${coupleName}`;
export const size = ogSize;
export const contentType = "image/png";

// Vẽ sẵn ảnh cho từng khách lúc build thay vì vẽ mỗi lần Zalo/Facebook hỏi
// (khách thêm sau thì ảnh vẽ ở lần hỏi đầu tiên; ít nhất một mã, xem page.tsx)
export async function generateStaticParams() {
  const guests = await getGuests();
  return guests.length > 0
    ? guests.map((g) => ({ code: g.code }))
    : [{ code: "chua-co-khach" }];
}

/** Thiệp xem trước riêng từng khách: "Thân mời Anh Tuấn và người thương" + ngày lễ đầu tiên được mời */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const guest = await findGuest((await params).code);
  if (!guest) return inviteCard({ date: wedding.date });
  return inviteCard({
    to: inviteeLabel(guest),
    date: guestEvents(guest)[0].time,
  });
}
