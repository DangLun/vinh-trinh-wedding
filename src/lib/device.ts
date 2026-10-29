/** Chuột/trackpad thật (không phải màn cảm ứng) */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function subscribeFinePointer(onChange: () => void) {
  const mq = matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export const hasFinePointer = () => matchMedia(FINE_POINTER_QUERY).matches;
