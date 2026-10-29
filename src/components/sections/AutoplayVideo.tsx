"use client";

import { useEffect, type ComponentProps } from "react";
import { useInView } from "@/hooks/useInView";

// Bắt đầu phát sớm một chút trước khi video trượt vào màn hình
const VIEW_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * Video tự phát (muted, lặp) nhưng chỉ khi đang ở trong màn hình:
 * cuộn qua là dừng, đỡ tốn GPU giải mã khung hình không ai xem.
 */
export function AutoplayVideo(
  props: Omit<ComponentProps<"video">, "autoPlay" | "ref">,
) {
  const [ref, inView] = useInView<HTMLVideoElement>(VIEW_OPTIONS);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (inView && !reduced) {
      // play() bị chặn (vd. chế độ tiết kiệm pin) thì để nguyên ảnh poster
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [ref, inView]);

  return <video ref={ref} muted loop playsInline {...props} />;
}
