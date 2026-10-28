@AGENTS.md

# Vinh & Trinh wedding landing page

Landing page đám cưới Vinh (chú rể) & Trinh (cô dâu), phong cách GenZ, nhiều hiệu ứng. Giao tiếp với chủ dự án bằng tiếng Việt.

## Stack

Next.js 16 (App Router, Cache Components bật), TypeScript, Tailwind v4, npm (máy không có pnpm). Deploy dự kiến: Vercel.
Hiệu ứng: motion, gsap + @gsap/react, lenis, canvas-confetti, swiper, photoswipe. Three.js (React Three Fiber) chỉ dùng cho 1–2 điểm nhấn, lazy-load, có fallback tĩnh cho máy yếu / prefers-reduced-motion.

## Cấu trúc

- `src/config/wedding.ts`: mọi thông tin đám cưới (dữ liệu mẫu, chờ thông tin thật), kiểu ở `src/types/wedding.ts`
- `src/config/theme.ts`: bảng màu, nguồn duy nhất cho CSS (gắn biến `--<tên>` lên `<html>`), 3D, confetti, SVG. Thêm màu → khai báo thêm trong `@theme` của `globals.css`
- `src/data/guests.ts`: danh sách khách; `/moi/[slug]` là link mời riêng ("Thân mời Anh Tuấn"), `/khach-moi` là trang danh sách
- `src/components/sections/*`: Hero, Marquee, Countdown, LoveStory, EventInfo, Gallery, GuestWall, Footer, ghép trong `WeddingPage.tsx`
- `src/components/ui/*`: khối dùng chung: `Section`/`SectionHeading` (khung + tiêu đề mỗi phần), `sticker()` (class viên thuốc Y2K, gắn được lên cả `motion.*`), `GradientMesh`
- `src/components/three/*`: `HeroRings` (lazy-load + fallback) → `HeroScene` (Canvas) → `WeddingRings`, `Floaters`, `ChromeMaterial`, `PastelStudio`, `FitToViewport`, `shapes.ts`
- `src/lib/*`: hàm thuần (date theo giờ VN, device/3D check, confetti, motion preset `springIn`, `cn`); `src/hooks/*`: `useCountdown`, `useInView`, `useCan3D`
- Không dùng barrel `index.ts` để three.js không lọt vào bundle chính.

## Trạng thái

- Đã xong: khung dự án, lint và build đều pass. Giao diện mới ở mức thô, các hiệu ứng còn đánh dấu `TODO`.
- Đã chốt: tông Pastel Y2K, Hero có 3D.
- Design system: màu trong `src/config/theme.ts` (milk, bubblegum, lilac, sky, butter, plum + tông nhạt blush, mist, ice, cream); font Unbounded (`font-display`) + Be Vietnam Pro; class `.y2k-type` cho chữ bóng lệch hồng/xanh.
- Hero 3D: cặp nhẫn chrome ánh xà cừ, tim/sao/bong bóng bay, chạm nhẫn → confetti; fallback SVG tĩnh khi reduced-motion, máy yếu, không WebGL2.
- Đã tái cấu trúc src (types, theme, ui primitives, lib, hooks, tách 3D); các section thô đã dùng `Section`/token màu.
- Bước tiếp: chờ duyệt Hero, rồi áp design system cho Marquee, Countdown, LoveStory, EventInfo, Gallery.
- Chưa có: RSVP / sổ lưu bút, nhạc nền, ảnh thật, OG image cho Zalo/FB.
