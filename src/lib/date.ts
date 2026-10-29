// Mọi ngày giờ hiển thị theo giờ Việt Nam, bất kể máy khách ở đâu
export const WEDDING_TIME_ZONE = "Asia/Ho_Chi_Minh";

const dotDate = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: WEDDING_TIME_ZONE,
});

const weekday = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  timeZone: WEDDING_TIME_ZONE,
});

const fullDateTime = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: WEDDING_TIME_ZONE,
});

const clock = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: WEDDING_TIME_ZONE,
});

/** "08:00" */
export const formatTime = (iso: string) => clock.format(new Date(iso));

/** "20.12.2026" */
export const formatDotDate = (iso: string) =>
  dotDate.format(new Date(iso)).replaceAll("/", ".");

/** "Chủ Nhật" */
export const formatWeekday = (iso: string) => weekday.format(new Date(iso));

/** "11:00 Chủ Nhật, 20 tháng 12, 2026" */
export const formatDateTime = (iso: string) =>
  fullDateTime.format(new Date(iso));

const parts = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: WEDDING_TIME_ZONE,
});

const part = (iso: string) => {
  const map = Object.fromEntries(
    parts.formatToParts(new Date(iso)).map((p) => [p.type, p.value]),
  );
  return (type: string) => map[type] ?? "";
};

/** "08 giờ 00 phút" (lời in trên thiệp cưới) */
export function formatClockWords(iso: string) {
  const p = part(iso);
  return `${p("hour")} giờ ${p("minute")} phút`;
}

/** "Chủ Nhật, ngày 14 tháng 02 năm 2027" (lời in trên thiệp cưới) */
export function formatDateWords(iso: string) {
  const p = part(iso);
  const day = p("weekday");
  return `${day[0].toUpperCase()}${day.slice(1)}, ngày ${p("day")} tháng ${p("month")} năm ${p("year")}`;
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function timeUntil(target: number, now = Date.now()): TimeLeft {
  const ms = Math.max(0, target - now);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}
