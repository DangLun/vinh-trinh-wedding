export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function subscribeReducedMotion(onChange: () => void) {
  const mq = matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export const prefersReducedMotion = () =>
  matchMedia(REDUCED_MOTION_QUERY).matches;

let webgl2: boolean | undefined;

/** 3D chỉ bật khi: không giảm chuyển động, máy đủ khỏe, có WebGL2 */
export function supports3D() {
  if (prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) {
    return false;
  }
  webgl2 ??= !!document.createElement("canvas").getContext("webgl2");
  return webgl2;
}

/** Chuột/trackpad thật (không phải màn cảm ứng) */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function subscribeFinePointer(onChange: () => void) {
  const mq = matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export const hasFinePointer = () => matchMedia(FINE_POINTER_QUERY).matches;
