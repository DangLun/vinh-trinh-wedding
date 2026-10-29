import { couple } from "@/config/wedding";
import { cn } from "@/lib/cn";

/**
 * Tên cặp đôi viết liền một khối "Trinh & Vinh" (thứ tự lấy từ `couple`): tên bằng thư pháp Imperial Script,
 * dấu "&" bằng Cormorant nghiêng nhỏ hơn (không chồng hai kiểu viết tay lên nhau).
 * Cỡ chữ lấy từ phần tử cha; `ampClassName` đổi màu "&" theo nền.
 */
export function CoupleName({
  className,
  ampClassName = "text-gold",
}: {
  className?: string;
  ampClassName?: string;
}) {
  return (
    <span className={cn("font-script", className)}>
      {couple[0].name}
      <span
        aria-label="và"
        className={cn(
          "mx-[0.18em] align-[0.12em] font-serif text-[0.5em] font-light italic",
          ampClassName,
        )}
      >
        &amp;
      </span>
      {couple[1].name}
    </span>
  );
}
