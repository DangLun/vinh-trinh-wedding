"use client";

import "photoswipe/style.css";
import type PhotoSwipeLightbox from "photoswipe/lightbox";
import { type ReactNode, useEffect, useRef } from "react";
import { pauseScroll } from "@/lib/scroll";

/**
 * Bấm ảnh/video bên trong → xem lớn bằng PhotoSwipe (vuốt, phóng to, phím mũi tên, Esc).
 * Mỗi mục là một thẻ `a[data-pswp-width]` (thuộc tính lấy từ `lightboxImage`); các mục trong
 * cùng một Lightbox là một bộ, chuyển qua lại được. Thư viện chỉ tải khi trang đã chạy,
 * và phần xem lớn chỉ tải lúc bấm ảnh đầu tiên.
 * Video dùng kiểu nội dung riêng "video": phát khi tới slide đó, dừng khi rời đi.
 */
export function Lightbox({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = ref.current;
    if (!gallery) return;
    let lightbox: PhotoSwipeLightbox | undefined;
    let cancelled = false;

    import("photoswipe/lightbox").then(({ default: Lightbox }) => {
      if (cancelled) return;
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      lightbox = new Lightbox({
        gallery,
        children: "a[data-pswp-width]",
        pswpModule: () => import("photoswipe"),
        // Khung ảnh là chính thẻ a: lớp ảnh bên trong to hơn khung (parallax) nên không lấy làm mốc
        thumbSelector: "a",
        showHideAnimationType: still ? "none" : "zoom",
        bgOpacity: 0.95,
        closeTitle: "Đóng",
        zoomTitle: "Phóng to",
        arrowPrevTitle: "Ảnh trước",
        arrowNextTitle: "Ảnh sau",
        errorMsg: "Không tải được ảnh này",
        indexIndicatorSep: " / ",
      });

      lightbox.addFilter("domItemData", (itemData, _el, linkEl) => {
        if (linkEl.dataset.poster) itemData.poster = linkEl.dataset.poster;
        return itemData;
      });
      lightbox.on("contentLoad", (e) => {
        const { content } = e;
        if (content.type !== "video") return;
        e.preventDefault();
        const wrap = document.createElement("div");
        wrap.className = "pswp-video";
        const video = document.createElement("video");
        video.src = String(content.data.src);
        if (typeof content.data.poster === "string") {
          video.poster = content.data.poster;
        }
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", String(content.data.alt ?? ""));
        wrap.append(video);
        content.element = wrap;
      });
      lightbox.on("contentActivate", ({ content }) => {
        // Trình duyệt có thể chặn tự phát có tiếng; khi đó khách bấm nút phát
        content.element
          ?.querySelector("video")
          ?.play()
          .catch(() => {});
      });
      lightbox.on("contentDeactivate", ({ content }) => {
        content.element?.querySelector("video")?.pause();
      });
      lightbox.on("beforeOpen", () => pauseScroll(true));
      lightbox.on("close", () => pauseScroll(false));
      lightbox.init();
    });

    return () => {
      cancelled = true;
      lightbox?.destroy();
      pauseScroll(false);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
