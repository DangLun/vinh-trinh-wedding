@AGENTS.md

# Vinh & Trinh wedding landing page

Landing page đám cưới Vinh (chú rể) & Trinh (cô dâu), phong cách GenZ, nhiều hiệu ứng. Giao tiếp với chủ dự án bằng tiếng Việt.

## Stack

Next.js 16 (App Router, Cache Components bật), TypeScript, Tailwind v4, npm (máy không có pnpm). Deploy: Vercel (project `vinh-trinh-wedding`, tự build khi push lên `main`). Tên miền đã chọn: **vinhtrinh.love** (chưa mua/gắn; nếu mua thêm `vinhtrinh.vn` thì chuyển hướng về `.love`).
Hiệu ứng: motion, gsap + @gsap/react, lenis, canvas-confetti, swiper, photoswipe. Three.js (React Three Fiber) chỉ dùng cho 1–2 điểm nhấn, lazy-load, có fallback tĩnh cho máy yếu / prefers-reduced-motion.

## Cấu trúc

- `src/config/wedding.ts`: mọi thông tin đám cưới (dữ liệu mẫu, chờ thông tin thật), kiểu ở `src/types/wedding.ts`
- `src/config/theme.ts`: nguồn màu duy nhất. `palette` (gắn biến `--<tên>` lên `<html>`, dùng cho CSS, 3D, confetti, SVG; thêm màu → khai báo thêm trong `@theme` của `globals.css`), `metals` (màu kim loại thật cho nhẫn 3D), `figure` (màu da, áo dài đội bưng quả, vest chú rể, đầm cô dâu)
- Thiệp mời riêng từng khách (không backend, dựng sẵn lúc build):
  - `src/data/guests.ts` (DỮ LIỆU MẪU): mỗi khách có `code` (mã link), `name`, `self` (cô dâu chú rể tự xưng), `formal`, `side`, `events` (lễ được mời, bỏ trống = tất cả), `plusOne`, `note`. Kiểu ở `src/types/guest.ts`; hàm ở `src/lib/guests.ts` (build báo lỗi nếu trùng/sai mã)
  - `/m/[code]`: `Envelope` (`src/components/invite/`: phong bì → thư mời → vào trang) + `WeddingPage guest=…` (Hero, đếm ngược, vé sự kiện, footer theo khách). Envelope chỉ nhận chuỗi từ server, KHÔNG import danh sách khách vào client component (để danh sách không lọt xuống trình duyệt)
  - Ảnh xem trước Zalo/FB: `src/app/opengraph-image.tsx` (chung) và `src/app/m/[code]/opengraph-image.tsx` (riêng từng khách, `generateStaticParams`), vẽ bằng `src/lib/og.tsx` với font TTF trong `assets/fonts` (ImageResponse không đọc woff2)
  - `/quan-ly`: trang quản lý (QR qua thư viện `qrcode`, sao chép link, chia sẻ, nút Đăng xuất). Khoá bằng `src/proxy.ts`: chưa đăng nhập → chuyển tới `/quan-ly/dang-nhap` (chỉ ô mật khẩu, `LoginForm` + Server Action `login`/`logout` trong `src/app/quan-ly/actions.ts`). Phiên = cookie `vt_admin` httpOnly 30 ngày "<hạn>.<HMAC>" ký bằng `ADMIN_PASSWORD` (`src/lib/admin-session.ts`, chỉ dùng ở server), đổi mật khẩu là mọi phiên cũ hết hiệu lực. Ở máy và trên Vercel đều phải đăng nhập (đã bỏ chế độ dev vào thẳng): mật khẩu ở `.env.local` (không commit), mẫu biến môi trường ở `.env.example`. Next 16: `middleware` đổi tên thành `proxy`
  - `src/config/site.ts`: `siteUrl` (NEXT_PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → localhost), dùng cho `metadataBase` và link tuyệt đối. `robots.ts` chặn `/m/` và `/quan-ly`
  - Với Cache Components, mã khách sai vẫn trả 200 (hiện trang 404); `dynamicParams` không dùng được. Trang `/m/[code]` đặt `export const instant = false` (đọc params ngoài Suspense; khách mở thẳng từ link nên không cần điều hướng tức thì), bỏ dòng này sẽ lại hiện lỗi `instant-shell-url-data` ở dev
- `src/components/sections/*`: Hero, Marquee, Countdown, LoveStory, EventInfo, Gallery, GuestWall, Footer, ghép trong `WeddingPage.tsx`
  - `TrayBearer.tsx`: nhân vật đội bưng quả cho Countdown (SVG chibi; nam áo dài xanh + khăn đóng, nữ áo dài đỏ + búi tóc cài mai). Lớp: thân SVG → mâm quả HTML đè lên ngực (nắp sơn mài đỏ viền vàng, núm vàng, số trong ô bầu dục vàng) → hai bàn tay SVG đỡ đáy mâm. Khung là `@container` nên cỡ chữ trong mâm dùng `cqw`. Cả đội nhún so le (`animate-bob`)
  - `Couple.tsx`: chibi chú rể (vest xanh than, nơ đỏ, hoa mai cài ngực) và cô dâu (đầm trắng xoè, voan, vương miện, bó hoa) + `CoupleFinale` ở cuối LoveStory
  - Nhân vật chibi dùng chung khung 100×172, mặt `Face`, tay `Arm`, `OUTLINE` trong `src/components/ui/Chibi.tsx`
  - `AutoplayVideo.tsx`: video album chỉ phát khi trong màn hình
- `src/components/ui/*`: khối dùng chung
  - `Section`/`SectionHeading` (khung + tiêu đề mỗi phần), `sticker()` (class viên thuốc Y2K, gắn được lên cả `motion.*`), `GradientMesh`, `Ticket` (vé có khấc + đường xé, dùng cho EventInfo; tái dùng được cho RSVP)
  - `MaiFlower` (hoa mai 5 cánh, dùng chung cho hoa rơi, dây ảnh, tóc nhân vật)
  - `Garland` (phần dùng chung của dây treo ảnh: `garlandPhotos` chia 10 ảnh cho 2 dây, `Thread` sợi tơ hồng, `HangingPolaroid` ảnh kẹp tim đung đưa)
- `src/components/three/*`: `HeroRings` (lazy-load + fallback) → `HeroScene` (Canvas) → `WeddingRings`, `Floaters`, `ChromeMaterial` (gồm `MetalMaterial` cho nhẫn), `PastelStudio`, `FitToViewport`, `StaticRings`, `shapes.ts`
- `src/components/effects/*`, gắn trong `WeddingPage.tsx`:
  - `PageBackdrop`: nền cố định cao 160vh, trôi chậm khi cuộn nên màu trời đổi dần theo trang (xanh sương → vàng mai → hồng)
  - `FallingPetals`: hoa mai, cánh mai, tim rơi chéo theo gió (30 cánh, mobile ẩn một nửa), thuần CSS, nằm trên nội dung (z-30, pointer-events-none), tắt khi reduced-motion
  - `HangingPhotos`: màn ≥1400px, 2 dây tơ hồng dọc hai lề, kết hoa mai, treo ảnh polaroid kẹp tim, bắt đầu dưới Hero; đung đưa nhẹ + lắc theo vận tốc cuộn
  - `PhotoLine`: màn <1400px, 2 dây tơ hồng nằm ngang trôi ngược chiều nhau, đặt sau Countdown và sau LoveStory
  - `CustomCursor`: con trỏ tự viết (sao 4 cánh + vòng ánh xà cừ + vệt sao), chỉ bật với chuột thật. Style inline, không phụ thuộc CSS toàn cục. Vật thể ngoài DOM (3D) đổi dạng con trỏ qua `setCursorVariant()` trong `src/lib/cursor.ts`
  - `SmoothScroll`: Lenis `lerp: 0.18` (mặc định 0.1 làm trang trôi trễ sau tay cuộn, trên trackpad Mac cảm giác như lag)
- `src/lib/*`: hàm thuần (date theo giờ VN, device/3D check, confetti, motion preset `springIn`, `cn`, `calendar`); `src/hooks/*`: `useCountdown`, `useInView`, `useCan3D`
- Không dùng barrel `index.ts` để three.js không lọt vào bundle chính.

## Quy ước

- Hiệu năng: keyframe CSS không dùng `var()` (buộc animation chạy trên luồng chính thay vì GPU; cần biến thể thì viết nhiều keyframe cứng như `petal-a/b/c`). 3D tối đa DPR 1.5. Video tự phát phải qua `AutoplayVideo`.
- Chữ có `.y2k-type` nằm trong khung `overflow-hidden` thì nới padding cho lớp bóng (lệch 0.08em phải/dưới), xem `RollingNumber` trong Countdown.
- Không dùng hiệu ứng gương/chrome CSS (đã thử và bỏ theo ý chủ dự án).

## Skills (`.claude/skills`)

- Cài bằng `npx skills` (theo dõi trong `skills-lock.json`): `threejs-*` (CloudAI-X/threejs-skills), `gsap-*` (greensock/gsap-skills, chính chủ)
- Chép tay từ MengTo/Skills (MIT, không có trong lock, cập nhật thủ công, đã bỏ ảnh demo): `no-ai-design-slop`, `gsap-scrolltrigger-storytelling`, `scroll-progress-timeline`, `staggered-word-reveal`
- Có sẵn trước: `frontend-design`, `ui-ux-pro-max`, `senior-frontend` (gần như rỗng, chỉ là template)

## Trạng thái

- Ngày: `wedding.date` = 14/02/2027 08:00 (Lễ Tân Hôn, trùng Valentine), Hero và Countdown lấy theo ngày này. Sự kiện: Lễ Vu Quy 13/02/2027 08:00 (nhà gái), Lễ Tân Hôn 14/02/2027 08:00 (nhà trai). Hai ngày này là mùng 8–9 Tết Đinh Mùi (Tết 6/2/2027). Địa chỉ, link bản đồ còn là chỗ giữ chỗ.
- Chủ đề đã chốt: Pastel Y2K + "xuân miền Tây × Valentine". Cưới ở miền Tây: tháng 2 mùa khô, sáng sớm gió bấc se lạnh. Màu: sáng sớm se lạnh (xanh/tím sương) → nắng hoa mai (vàng) → ngọt ngào (hồng, đỏ lì xì `lixi`, đỏ rượu `plum` cho chữ). Miền Tây chưng mai vàng: không dùng hoa đào, không có tuyết.
- Design system: màu `milk, bubblegum, lilac, sky, butter, plum, lixi` + tông nhạt `blush, mist, ice, cream`; `lixi` chỉ làm điểm nhấn, chữ trên nền lixi dùng `text-milk`. Font (khai báo ở `src/app/fonts.ts`): Agbalumo (`font-display`, tên + tiêu đề, chỉ có weight 400 nên không dùng class đậm; `font-synthesis: none`), Fraunces bản mềm SOFT/WONK (`font-numeric`, giờ/ngày/đếm ngược), Be Vietnam Pro (nội dung); `.y2k-type` cho chữ bóng lệch hồng/xanh.
- Hero 3D: cặp nhẫn kim loại thật (vàng hồng + vàng 18K, `MetalMaterial` + `metals`; môi trường kiểu chụp trang sức: dải đèn trắng mảnh + tấm hắt ngà, đừng thêm mảng sáng to vì sẽ ra chất nhựa), tim/sao/bong bóng bay, chạm nhẫn → confetti; fallback SVG tĩnh (gradient kim loại) khi reduced-motion, máy yếu, không WebGL2.
- Đã làm xong giao diện: Hero, Marquee (nền đỏ lì xì; chữ: TEAM INH INH, VALENTINE, VINH ♥ TRINH, CƯỚI ĐẦU XUÂN), Countdown (đội bưng quả 2 nam 2 nữ đứng sẵn, chỉ nhún tại chỗ — đã bỏ hiệu ứng bước vào khi cuộn theo ý chủ dự án; mobile: mâm "ngày" một hàng, 3 mâm còn lại hàng dưới), EventInfo (2 vé Ticket, nút Chỉ đường + Lưu vào lịch Google), dây ảnh hai bên, hoa rơi, nền đổi màu.
- Hiệu ứng khi cuộn (dùng `motion` `useScroll`/`useInView`, tôn trọng reduced-motion):
  - Hero: cuộn xuống thì "Vinh" trượt trái, "Trinh" trượt phải, nhẫn thu nhỏ + xoay (`HeroRings` nhận `sceneStyle`/`hintStyle` riêng để dòng gợi ý không xoay theo), "&" + ngày + gợi ý mờ dần. Hiệu ứng xuất hiện ban đầu và mờ theo cuộn cùng dùng opacity nên tách thành 2 lớp lồng nhau.
  - LoveStory: sợi tơ hồng vẽ dần theo cuộn (đầu sợi có tim, luôn ở giữa màn hình), mốc bật ra khi đầu sợi chạm tới (mốc có `image` thì hiện ảnh đầu thẻ, dán băng washi; đang dùng ảnh mẫu album). Cuối đường là cô dâu chú rể tiến lại gần theo cuộn, nắm tay đúng lúc đầu sợi chỉ chạm tới tay (container sợi chỉ có `pb-28 sm:pb-36` khớp với margin âm của `CoupleFinale`, đổi kích thước nhân vật thì sửa cả hai), rồi bật tim + `heartBurst()` một lần. Sợi chỉ ở giữa (desktop, mốc so le) hoặc lề trái (mobile).
- Còn thô / TODO: Gallery (bento + lightbox PhotoSwipe).
- Tailwind v4 nạp qua `@tailwindcss/postcss` (`postcss.config.mjs`), theo docs Next 16. Đã bỏ loader `@tailwindcss/turbopack` vì nó làm Turbopack cache giữ `globals.css` cũ (sửa CSS không ăn ở cả dev lẫn build). Nếu CSS không cập nhật: tắt dev, `rm -rf .next`, chạy lại.
- Album đang dùng DỮ LIỆU MẪU: `src/data/sample-gallery.ts` (18 ảnh Unsplash/picsum + 2 video tự dựng) trong `public/images/gallery/sample`, `public/videos/sample` (nguồn: `CREDITS.md`). Gallery hỗ trợ `type: "image" | "video"`. Dây ảnh hai bên lấy 10 ảnh đầu từ album. Thay bằng ảnh thật trước khi ra mắt.
- Chưa có: RSVP / sổ lưu bút, nhạc nền, ảnh thật, OG image cho Zalo/FB.
- Chưa commit/push gì lên git (remote `origin` đã trỏ tới github.com/DangLun/vinh-trinh-wedding).
