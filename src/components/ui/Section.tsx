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

/** Khung chuẩn cho mỗi phần của trang: căn giữa, lề hai bên, khoảng cách dọc. */
export function Section({ width = "md", className, ...props }: SectionProps) {
  return (
    <section
      className={cn("mx-auto px-5 py-16 sm:px-10", widths[width], className)}
      {...props}
    />
  );
}

export function SectionHeading({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-display mb-8 text-3xl font-bold sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}
