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

/** "20.12.2026" */
export const formatDotDate = (iso: string) =>
  dotDate.format(new Date(iso)).replaceAll("/", ".");

/** "Chủ Nhật" */
export const formatWeekday = (iso: string) => weekday.format(new Date(iso));

/** "11:00 Chủ Nhật, 20 tháng 12, 2026" */
export const formatDateTime = (iso: string) =>
  fullDateTime.format(new Date(iso));

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
