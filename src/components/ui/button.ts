import { cn } from "@/lib/cn";

const tones = {
  // Nút chính: đỏ son, chữ ngà. Mỗi màn hình chỉ nên có một nút này.
  son: "bg-son text-ivory hover:bg-[#861616]",
  // Nút chính trên thiệp mời (chữ đỏ rượu): nền đỏ rượu, chữ ngà
  wine: "bg-wine text-linen hover:bg-[#661a24]",
  // Nút chính trên nền đỏ rượu (mặt trong thiệp mời): nền ngà, chữ đỏ rượu
  linen: "bg-linen text-wine hover:bg-white",
  // Nút phụ trên nền ngà: viền mực mảnh
  outline: "border border-ink/40 text-ink hover:border-ink",
  // Nút phụ trên nền sơn mài: viền vàng lá
  gold: "border border-gold/60 text-gold hover:border-gold",
} as const;

export type ButtonTone = keyof typeof tones;

/**
 * Class nút: góc vuông nhẹ, chữ thường, giãn chữ vừa phải.
 * Là hàm thay vì component để gắn được lên cả <a>, <button> lẫn motion.*.
 */
export function button({
  tone = "outline",
  className,
}: { tone?: ButtonTone; className?: string } = {}) {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-sm font-normal tracking-[0.06em] transition-colors duration-500 ease-luxe",
    tones[tone],
    className,
  );
}
