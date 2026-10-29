import { WEDDING_TIME_ZONE } from "@/lib/date";

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

// "2027-02-13T08:00:00+07:00" -> "20270213T010000Z"
const utcStamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** Link mở Google Calendar với sự kiện điền sẵn (người xem tự bấm lưu). */
export function googleCalendarUrl({
  title,
  start,
  end,
  location,
  details,
}: {
  title: string;
  start: string;
  end?: string;
  location?: string;
  details?: string;
}) {
  const from = new Date(start);
  const to = end
    ? new Date(end)
    : new Date(from.getTime() + DEFAULT_DURATION_MS);
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", `${utcStamp(from)}/${utcStamp(to)}`);
  url.searchParams.set("ctz", WEDDING_TIME_ZONE);
  if (location) url.searchParams.set("location", location);
  if (details) url.searchParams.set("details", details);
  return url.toString();
}
