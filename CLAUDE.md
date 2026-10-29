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
- `src/components/ui/*`: khối dùng chung: `Section`/`SectionHeading` (khung + tiêu đề mỗi phần), `sticker()` (class viên thuốc Y2K, gắn được lên cả `motion.*`), `GradientMesh`, `Ticket` (vé có khấc + đường xé, dùng cho EventInfo; tái dùng được cho RSVP)
- `src/components/three/*`: `HeroRings` (lazy-load + fallback) → `HeroScene` (Canvas) → `WeddingRings`, `Floaters`, `ChromeMaterial`, `PastelStudio`, `FitToViewport`, `shapes.ts`
- `src/lib/*`: hàm thuần (date theo giờ VN, device/3D check, confetti, motion preset `springIn`, `cn`); `src/hooks/*`: `useCountdown`, `useInView`, `useCan3D`
- `src/components/effects/PageBackdrop.tsx` (nền loang pastel cố định sau cả trang, trôi chậm khi cuộn) và `HangingPhotos.tsx` (2 dây treo ảnh polaroid kẹp tim ở hai lề, chỉ ≥1400px, bắt đầu dưới Hero; đung đưa nhẹ + lắc theo vận tốc cuộn; lấy 10 ảnh từ `wedding.gallery`), gắn trong `WeddingPage.tsx`
- `src/components/effects/CustomCursor.tsx`: con trỏ tự viết (sao 4 cánh + vòng ánh xà cừ + vệt sao), chỉ bật với chuột thật. Style inline, không phụ thuộc CSS toàn cục. Vật thể ngoài DOM (3D) đổi dạng con trỏ qua `setCursorVariant()` trong `src/lib/cursor.ts`
- Không dùng barrel `index.ts` để three.js không lọt vào bundle chính.

## Skills (`.claude/skills`)

- Cài bằng `npx skills` (theo dõi trong `skills-lock.json`): `threejs-*` (CloudAI-X/threejs-skills), `gsap-*` (greensock/gsap-skills, chính chủ)
- Chép tay từ MengTo/Skills (MIT, không có trong lock, cập nhật thủ công, đã bỏ ảnh demo): `no-ai-design-slop`, `gsap-scrolltrigger-storytelling`, `scroll-progress-timeline`, `staggered-word-reveal`
- Có sẵn trước: `frontend-design`, `ui-ux-pro-max`, `senior-frontend` (gần như rỗng, chỉ là template)

## Trạng thái

- Đã xong: khung dự án, lint và build đều pass. Giao diện mới ở mức thô, các hiệu ứng còn đánh dấu `TODO`.
- Đã chốt: tông Pastel Y2K, Hero có 3D.
- Design system: màu trong `src/config/theme.ts` (milk, bubblegum, lilac, sky, butter, plum + tông nhạt blush, mist, ice, cream); font (khai báo ở `src/app/fonts.ts`): Agbalumo (`font-display`, tên + tiêu đề, chỉ có weight 400 nên không dùng class đậm; `font-synthesis: none`), Fraunces bản mềm SOFT/WONK (`font-numeric`, giờ/ngày/đếm ngược), Be Vietnam Pro (nội dung); class `.y2k-type` cho chữ bóng lệch hồng/xanh; "hiệu ứng gương" chrome pastel: `.chrome-text` (tên ở Hero, có vệt sáng lướt) và `.chrome-border` (ô đếm ngược, nền ô qua biến `--tile`), gradient chung `--chrome` trong `globals.css`. Chỉ dùng cho điểm nhấn.
- Hero 3D: cặp nhẫn chrome ánh xà cừ, tim/sao/bong bóng bay, chạm nhẫn → confetti; fallback SVG tĩnh khi reduced-motion, máy yếu, không WebGL2.
- Đã tái cấu trúc src (types, theme, ui primitives, lib, hooks, tách 3D); các section thô đã dùng `Section`/token màu.
- Bước tiếp: chờ duyệt Hero, rồi áp design system cho Marquee, Countdown, LoveStory, EventInfo, Gallery.
- Tailwind v4 nạp qua `@tailwindcss/postcss` (`postcss.config.mjs`), theo docs Next 16. Đã bỏ loader `@tailwindcss/turbopack` vì nó làm Turbopack cache giữ `globals.css` cũ (sửa CSS không ăn ở cả dev lẫn build).
- Album đang dùng DỮ LIỆU MẪU: `src/data/sample-gallery.ts` (18 ảnh Unsplash/picsum + 2 video tự dựng) trong `public/images/gallery/sample`, `public/videos/sample` (nguồn: `CREDITS.md`). Gallery hỗ trợ `type: "image" | "video"`. Thay bằng ảnh thật trước khi ra mắt.
- Chưa có: RSVP / sổ lưu bút, nhạc nền, ảnh thật, OG image cho Zalo/FB.
