import { cn } from "@/lib/cn";

const tones = {
  butter: "bg-butter text-plum",
  bubblegum: "bg-bubblegum text-white",
  glass: "bg-white/80 text-plum backdrop-blur",
} as const;

export type StickerTone = keyof typeof tones;

/**
 * Class cho "sticker" Y2K: viên thuốc viền mận, có thể kèm bóng đổ cứng.
 * Là hàm thay vì component để gắn được lên cả thẻ thường lẫn motion.*.
 */
export function sticker({
  tone = "glass",
  shadow = true,
  className,
}: { tone?: StickerTone; shadow?: boolean; className?: string } = {}) {
  return cn(
    "inline-block rounded-full border-2 border-plum",
    tones[tone],
    shadow && "shadow-[3px_3px_0_var(--plum)]",
    className,
  );
}
