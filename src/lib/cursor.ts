export type CursorVariant = "default" | "hover";

export const CURSOR_EVENT = "cursor:variant";

/** Phần tử DOM được coi là bấm được → con trỏ chuyển sang dạng hover */
export const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], label, summary, select, [data-cursor='hover']";

/**
 * Đổi dạng con trỏ từ nơi không phải DOM (vd. vật thể 3D trong canvas).
 * Phần tử DOM thường không cần gọi — chỉ cần khớp INTERACTIVE_SELECTOR.
 */
export function setCursorVariant(variant: CursorVariant) {
  window.dispatchEvent(
    new CustomEvent<CursorVariant>(CURSOR_EVENT, { detail: variant }),
  );
}

/** Ảnh/video xem được → con trỏ nở vòng và hiện chữ "Xem" */
export const VIEW_SELECTOR = "img, video, [data-cursor='view']";
