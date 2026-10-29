import { coupleName, wedding } from "@/config/wedding";
import { guests } from "@/data/guests";
import { findGuest, guestEvents, inviteeLabel } from "@/lib/guests";
import { inviteCard, ogSize } from "@/lib/og";

export const alt = `Thiệp mời đám cưới ${coupleName}`;
export const size = ogSize;
export const contentType = "image/png";

// Vẽ sẵn ảnh cho từng khách lúc build thay vì vẽ mỗi lần Zalo/Facebook hỏi
export function generateStaticParams() {
  return guests.map((g) => ({ code: g.code }));
}

/** Thiệp xem trước riêng từng khách: "Thân mời Anh Tuấn và người thương" + ngày lễ đầu tiên được mời */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const guest = findGuest((await params).code);
  if (!guest) return inviteCard({ date: wedding.date });
  return inviteCard({
    to: inviteeLabel(guest),
    date: guestEvents(guest)[0].time,
  });
}
