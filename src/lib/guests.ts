import { guests } from "@/data/guests";

export function findGuest(slug: string) {
  return guests.find((g) => g.slug === slug);
}

// "Gia đình chị Lan" -> "gia-dinh-chi-lan"
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
