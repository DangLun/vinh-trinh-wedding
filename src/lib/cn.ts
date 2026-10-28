/** Ghép className, bỏ qua giá trị rỗng/false. Không gộp class Tailwind xung đột. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
