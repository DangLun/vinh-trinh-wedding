import { useSyncExternalStore } from "react";

/** id của lớp màn mở đầu (Intro), dùng chung cho inline script, Intro và Hero */
export const INTRO_ID = "intro";

/** Đã xem màn mở đầu thì những lần sau vào thẳng trang */
export const INTRO_SEEN_KEY = "vt-intro-seen";

const OPEN_EVENT = "intro:open";

// Cửa đã bắt đầu mở (đặt bởi Intro). Biến cấp module: chỉ sống trong một lần tải trang.
let opened = false;

export function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    // Trình duyệt chặn localStorage (chế độ riêng tư…): coi như chưa xem
    return false;
  }
}

/** Intro gọi khi hai cánh cửa bắt đầu mở: Hero được phép chạy hiệu ứng xuất hiện */
export function markIntroOpen() {
  opened = true;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(OPEN_EVENT, onChange);
  return () => window.removeEventListener(OPEN_EVENT, onChange);
}

// Không có màn mở đầu (vd. link mời riêng đã có phong bì) hoặc màn bị ẩn vì đã xem → mở sẵn
function getSnapshot() {
  if (opened) return true;
  const el = document.getElementById(INTRO_ID);
  return !el || el.hidden;
}

/**
 * true khi phần sau màn mở đầu đã lộ ra. Hero dùng để chờ cửa mở rồi mới cho tên trồi lên,
 * thay vì chạy hết hiệu ứng sau lưng cánh cửa.
 */
export function useIntroOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
