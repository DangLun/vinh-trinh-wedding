import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
} as const;

type SectionProps = ComponentProps<"section"> & {
  width?: keyof typeof widths;
};

/** Khung chuẩn cho mỗi phần của trang: căn giữa, lề hai bên, khoảng cách dọc rộng. */
export function Section({ width = "md", className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto px-5 py-24 sm:px-10 sm:py-32",
        widths[width],
        className,
      )}
      {...props}
    />
  );
}

/** Tiêu đề phần: Cormorant nét mảnh, cỡ lớn; độ đậm không dùng để nhấn. */
export function SectionHeading({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mb-14 font-serif text-5xl leading-[1.1] font-light text-balance sm:mb-20 sm:text-6xl",
        className,
      )}
      {...props}
    />
  );
}
