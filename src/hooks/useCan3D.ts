"use client";

import { useSyncExternalStore } from "react";
import { subscribeReducedMotion, supports3D } from "@/lib/device";

/** false trên server và máy không đủ điều kiện; tự cập nhật khi đổi cài đặt giảm chuyển động. */
export function useCan3D() {
  return useSyncExternalStore(subscribeReducedMotion, supports3D, () => false);
}
