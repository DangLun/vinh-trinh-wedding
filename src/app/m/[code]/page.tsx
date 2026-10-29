import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Envelope from "@/components/invite/Envelope";
import WeddingPage from "@/components/WeddingPage";
import { coupleName, lunarYearName } from "@/config/wedding";
import { guests } from "@/data/guests";
import {
  formatClockWords,
  formatDateWords,
  formatDotDate,
  formatTime,
  formatWeekday,
} from "@/lib/date";
import { findGuest, guestEvents, inviteeLabel, inviteVerb } from "@/lib/guests";

// Trang cần đọc mã khách trên URL trước khi vẽ. Khách luôn mở thẳng từ link (Zalo…), không
// điều hướng từ trang khác trong app, nên cho phép chặn thay vì đòi hiện tức thì
// (tắt cảnh báo "instant-shell-url-data" của Cache Components ở chế độ dev).
export const instant = false;

// Dựng sẵn trang cho từng khách lúc build; mã không có trong danh sách → 404
export function generateStaticParams() {
  return guests.map((g) => ({ code: g.code }));
}

export async function generateMetadata({
  params,
}: PageProps<"/m/[code]">): Promise<Metadata> {
  const guest = findGuest((await params).code);
  if (!guest) return {};
  const title = `Thân mời ${inviteeLabel(guest)} | ${coupleName}`;
  const description = `${inviteVerb(guest)} ${inviteeLabel(guest)} đến chung vui trong ngày cưới của ${coupleName} 💌`;
  return {
    title,
    description,
    openGraph: { title, description },
    // Link riêng của từng khách: không cho máy tìm kiếm lập chỉ mục
    robots: { index: false, follow: false },
  };
}

export default async function InvitePage({ params }: PageProps<"/m/[code]">) {
  const guest = findGuest((await params).code);
  if (!guest) notFound();

  // Chỉ chuyền xuống Envelope (client) đúng vài chuỗi của khách này
  const events = guestEvents(guest).map((e) => ({
    title: e.title,
    place: e.place,
    address: e.address,
    when: `${formatTime(e.time)}, ${formatWeekday(e.time)} ${formatDotDate(e.time)}`,
    clock: formatClockWords(e.time),
    day: formatDateWords(e.time),
    lunar:
      e.lunar &&
      `Nhằm ${e.lunar[0].toLowerCase()}${e.lunar.slice(1)} năm ${lunarYearName}`,
  }));

  const first = guestEvents(guest)[0];

  return (
    <>
      <Envelope
        to={inviteeLabel(guest)}
        verb={inviteVerb(guest)}
        note={guest.note}
        events={events}
        date={formatDotDate(first.time)}
      />
      <WeddingPage guest={guest} />
    </>
  );
}
