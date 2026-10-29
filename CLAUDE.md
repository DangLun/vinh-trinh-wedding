@AGENTS.md

# Trinh & Vinh wedding landing page

Landing page đám cưới Trinh (cô dâu) & Vinh (chú rể). Giao tiếp với chủ dự án bằng tiếng Việt.

Phong cách hiện tại: **"Sơn Mài & Ngà"**, sang trọng, cưới đầu xuân miền Tây (branch `redesign/luxury`). Bản cũ GenZ / pastel Y2K / chibi / 3D vẫn nằm ở `main` (đang chạy trên production) cho tới khi merge. KHÔNG merge vào `main` hay push khi chủ dự án chưa đồng ý rõ ràng, vì làm vậy là thay trang đang chạy.

## Stack

Next.js 16 (App Router, Cache Components bật), TypeScript, Tailwind v4, npm (máy không có pnpm). Deploy: Vercel (project `vinh-trinh-wedding`): production theo `main`, branch khác ra bản preview `vinh-trinh-wedding-git-<branch>-<team>.vercel.app`. Tên miền đã chọn: **vinhtrinh.love** (chưa mua/gắn; nếu mua thêm `vinhtrinh.vn` thì chuyển hướng về `.love`).
Hiệu ứng: `motion` (motion/react) là chính, `lenis` cuộn mượt. `photoswipe` để dành cho lightbox album. Đã gỡ (chủ dự án đồng ý): `three`, `@react-three/*`, `canvas-confetti`, `gsap`, `@gsap/react`, `swiper` và các gói `@types` đi kèm.

## Thiết kế "Sơn Mài & Ngà"

- Màu: nguồn duy nhất là `palette` trong `src/config/theme.ts` (gắn biến `--<tên>` lên `<html>`; thêm màu → khai báo thêm trong `@theme inline` của `globals.css`). Không còn `metals`/`figure`.
  - `lacquer` #14100d (nền sơn mài đen), `umber` (quầng nâu), `gold` #c9a24a / `goldDeep` (vàng lá: viền chỉ, điểm nhấn), `son` #9e1b1b (đỏ son: nút chính trang cưới)
  - `ivory` #faf6ee, `paper` #efe6d2 (giấy ngà), `ink` #2a2522 (chữ trên nền sáng), `stone` (chữ phụ)
  - Riêng thiệp mời theo mẫu thiệp giấy: `linen` #f5f1ea (kem trắng), `wine` #7a1f2b (đỏ rượu)
  - Class `.lacquer` (globals.css): nền sơn mài có hạt nhiễu SVG + quầng umber, dùng cho Hero, Countdown, Footer, Intro, thiệp mời, trang đăng nhập.
- Font (`src/app/fonts.ts`, đều có subset vietnamese):
  - `font-sans` Be Vietnam Pro 300/400/500 (nội dung)
  - `font-serif` Cormorant Garamond 300/400/500 + italic (tiêu đề, số; `.figures` = số lining tabular)
  - `font-script` Imperial Script (monogram T&V)
  - `font-signature` Waterfall (tên cặp đôi kiểu chữ ký: Hero, thiệp mời, ảnh OG)
- Easing trong `@theme`: `ease-luxe` (= `easeLuxe` [0.16,1,0.3,1] trong `src/lib/motion.ts`), `ease-curtain`. `riseIn(order, baseDelay, play)` là preset xuất hiện.
- Hoa mai vàng (miền Tây chưng mai, không dùng hoa đào, không tuyết): `MaiFlower` (`tone: "line" | "fill"`), `MaiBranch` (viewBox có lề + `overflow="visible"` để hoa ở mép không bị cắt).
- Thứ tự tên luôn là **Trinh & Vinh**: lấy từ `couple = [wedding.bride, wedding.groom]` và `coupleName` trong `src/config/wedding.ts`, đừng viết cứng.

## Cấu trúc

- `src/config/wedding.ts`: mọi thông tin đám cưới (DỮ LIỆU MẪU, chờ thông tin thật), kiểu ở `src/types/wedding.ts`.
  - `bride`/`groom`: `name`, `fullName`, `rank` (thứ bậc trong nhà: "Út Nữ", "Trưởng Nam"…)
  - `families.bride/groom`: `parents` (mỗi dòng "Ông …"/"Bà …"; chữ đầu tách ra viết tay trên thiệp; một bên chỉ có một phụ huynh thì để một dòng), `address`
  - `events[]` có `lunar` ("Mùng 8 tháng Giêng"); `heroImage`; `marquee`; `hashtag` (`#TrinhVinhForever`, theo thứ tự tên)
  - Export thêm: `couple`, `coupleName`, `lunarYearName` ("Đinh Mùi"), `lunarYear` ("Xuân Đinh Mùi"), `lunarOf(iso)`
- `src/lib/date.ts`: định dạng theo giờ VN; có `formatClockWords` ("08 giờ 00 phút") và `formatDateWords` ("Chủ Nhật, ngày 14 tháng 02 năm 2027") cho thiệp.
- Trang chung `/` (`src/app/page.tsx`): `<Intro />` + `<WeddingPage />`.
- `src/components/WeddingPage.tsx`: Hero, Marquee, Countdown, LoveStory, EventInfo, Gallery, Footer.
- Màn mở đầu và cổng hiệu ứng Hero (`src/lib/intro.ts`):
  - `Intro` (`src/components/effects/Intro.tsx`, chỉ ở trang chung): hai cánh cửa sơn mài, monogram T&V tách đôi ở khe cửa, vòng tròn tự vẽ. Đã xem (localStorage `vt-intro-seen`) thì inline script ẩn ngay từ đầu (không nháy); có nút "Bỏ qua".
  - Lớp nào đang làm màn mở đầu thì mang `id={INTRO_ID}`: cửa sơn mài ở trang chung, thiệp mời ở link riêng. `useIntroOpen()` trả false khi lớp đó còn trên trang; lớp đó gọi `markIntroOpen()` lúc bắt đầu khép lại. Hero chờ cổng này rồi mới chạy hiệu ứng xuất hiện, để hiệu ứng không chạy hết sau lưng lớp phủ.
- Thiệp mời riêng từng khách (không backend, dựng sẵn lúc build):
  - `src/data/guests.ts` (DỮ LIỆU MẪU): mỗi khách có `code` (mã link), `name`, `self` (cô dâu chú rể tự xưng), `formal`, `side`, `events` (lễ được mời, bỏ trống = tất cả), `plusOne`, `note`. Kiểu ở `src/types/guest.ts`; hàm ở `src/lib/guests.ts` (build báo lỗi nếu trùng/sai mã).
  - `/m/[code]` (`src/app/m/[code]/page.tsx`): định dạng sẵn mọi chuỗi ở server (`InviteEvent`: `title, place, address, when, clock, day, lunar`) rồi truyền vào `Envelope` + `WeddingPage guest=…`. Envelope chỉ nhận chuỗi từ server, KHÔNG import danh sách khách vào client component (để danh sách không lọt xuống trình duyệt).
  - `Envelope` (`src/components/invite/Envelope.tsx`) theo mẫu thiệp giấy, từ đầu tới cuối là MỘT tấm thiệp 3D (thẻ cha `preserve-3d`, mặt trước/sau `backface-visibility: hidden`):
    1. Mặt trước (nền `linen`, chữ `wine`): "SAVE The DATE", `SignatureNames` tự vẽ nét tim, ngày dương, "Trân trọng kính mời" (màu `ink`) + tên khách; tấm ngày nhỏ `DateCard` ló sau góc. Không ghi ngày âm ở mặt ngoài.
    2. Chạm → nhấc lên, lật 180° quanh trục dọc (1.2s).
    3. Mặt sau = bìa gấp hai cánh khép kín thiệp: cánh trái + nắp chéo bên phải (clip-path `PANEL`/`FLAP`, nắp đè lên và đổ bóng), nơ đỏ rượu `Bow` ở mũi nắp. Nơ giật nhẹ rồi tuột rơi, nắp phải mở, cánh trái mở theo (`Leaf`, mỗi cánh tự có `transformPerspective`, không lồng preserve-3d vì từng lỗi xếp lớp).
    4. Bìa rơi xuống mờ đi, thiệp đỏ `LetterCard` nằm lại đúng chỗ (nhích lên + đổ bóng). Bố cục theo thiệp giấy: hai họ hai cột → "Trân trọng báo tin / {lễ} của con chúng tôi" → họ tên cô dâu / dòng thứ bậc kẹp `HeartLine` / họ tên chú rể (chữ ký) → nơi cử hành → giờ, ngày, ngày âm.
    5. `Invitation` dưới thiệp: lễ còn lại, lời mời riêng, `note`, nút "Vào xem thiệp" (gọi `markIntroOpen()`). Giảm chuyển động: chạm là tới thẳng thiệp đỏ.
    - Tổng khoảng 3.5s. Chủ dự án đã chỉnh tốc độ hai lần (chê chậm/nhanh, "không đúng vật lý"): giữ cảm giác giấy thật (nhấc–lật–đặt, nơ rơi có trọng lực, nắp nhấc chậm rồi đổ xuống).
  - `SignatureNames` (`src/components/ui/SignatureNames.tsx`): "Trinh ~♡~ Vinh" font Waterfall, nét nối lượn sóng + tim có khuyên ở mũi (`lineClassName` đổi màu riêng nét tim, vd vàng trên Hero). Đường nét và hình mực ở `src/lib/heart-line.ts` (file thường, không "use client", để ảnh OG ở server dùng chung). Nét đậm nhạt kiểu ngòi nhọn Imperial Script, tạo bằng `penStroke()` (`src/lib/pen.ts`: đường giữa → các hình tô kín, đi xuống thì đậm, đi lên/ngang mảnh). Vì là hình tô kín, hiệu ứng tự vẽ dùng `<mask>` chạy `pathLength` dọc đường giữa. Chủ dự án đã duyệt hình dáng và độ đậm hiện tại (`hair: 1.2, thick: 4.4`; bản nhỏ `HeartLine` dày hơn).
  - Ảnh xem trước Zalo/FB: `src/app/opengraph-image.tsx` (chung) và `src/app/m/[code]/opengraph-image.tsx` (riêng từng khách, `generateStaticParams`), vẽ bằng `src/lib/og.tsx`: nền sơn mài, khung chỉ vàng đôi, hoa mai, tên Waterfall nối nét tim vàng (`HEART_INK`). Font TTF trong `assets/fonts` (ImageResponse không đọc woff2); italic phải đăng ký tên họ riêng ("Cormorant Italic"); trong `<svg>` của Satori chỉ dùng thẻ gốc nên gọi `MaiFlower({...})` như hàm.
  - `/quan-ly`: trang quản lý (QR qua thư viện `qrcode`, sao chép link, chia sẻ, nút Đăng xuất). Khoá bằng `src/proxy.ts`: chưa đăng nhập → chuyển tới `/quan-ly/dang-nhap` (chỉ ô mật khẩu, `LoginForm` + Server Action `login`/`logout` trong `src/app/quan-ly/actions.ts`). Phiên = cookie `vt_admin` httpOnly 30 ngày "<hạn>.<HMAC>" ký bằng `ADMIN_PASSWORD` (`src/lib/admin-session.ts`, chỉ dùng ở server), đổi mật khẩu là mọi phiên cũ hết hiệu lực. Ở máy và trên Vercel đều phải đăng nhập: mật khẩu ở `.env.local` (không commit), mẫu ở `.env.example`; bản preview trên Vercel cần biến `ADMIN_PASSWORD` có scope Preview. Next 16: `middleware` đổi tên thành `proxy`.
  - `src/config/site.ts`: `siteUrl` (NEXT_PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → localhost), dùng cho `metadataBase` và link tuyệt đối. `robots.ts` chặn `/m/` và `/quan-ly`.
  - Với Cache Components, mã khách sai vẫn trả 200 (hiện trang 404); `dynamicParams` không dùng được. Trang `/m/[code]` đặt `export const instant = false` (đọc params ngoài Suspense; khách mở thẳng từ link nên không cần điều hướng tức thì), bỏ dòng này sẽ lại hiện lỗi `instant-shell-url-data` ở dev.
- `src/components/sections/*`:
  - `Hero`: nền sơn mài + quầng vàng, hai cành mai góc (mobile nhỏ hơn, `pb-28` để không đè dòng ngày âm). `ArchPortrait`: ảnh `heroImage` trong khung vòm (clip-path `inset(... round 999px 999px 0 0)` mở từ dưới lên, ảnh lắng 1.15→1, trôi parallax khi cuộn, viền chỉ vàng). Tên `SignatureNames` (nét tim vàng) đè lên đáy vòm, hiện kiểu "viết" bằng clip-path (nới `-m/p-[0.3em]` để nét lượn không bị cắt). Dưới là ngày, thứ, ngày âm + năm.
  - `Marquee`: chữ serif nghiêng vàng sẫm, ngăn bằng hoa mai.
  - `Countdown`: nền `.lacquer`, mỗi số trong một tráp sơn mài đỏ `LacquerBox` (cỡ số theo container query).
  - `LoveStory`: sợi chỉ đỏ son 1px vẽ theo cuộn, ảnh mốc hiện bằng clip-path; cuối là `Finale` với `Monogram` có vòng tròn vẽ theo cuộn.
  - `EventInfo`: thẻ giấy ngà viền vàng đôi, có ngày âm, nút "Chỉ đường" (son) + "Lưu vào lịch" (outline).
  - `Gallery` + `GalleryReveal`: ảnh lộ bằng clip-path, scale 1.2→1, parallax ±6%, so le theo cột (`order = i % 3`). `AutoplayVideo`: video chỉ phát khi trong màn hình.
  - `Footer`: nền sơn mài, Monogram, cành mai, hashtag.
- `src/components/ui/*`: `Section`/`SectionHeading` (serif light), `button({ tone, className })` (`src/components/ui/button.ts`; tone `son`, `wine`, `linen`, `outline`, `gold`. `cn` chỉ nối chuỗi, không merge class Tailwind, nên đổi màu bằng tone chứ đừng đè class), `SignatureNames`/`HeartLine`, `BackToTop` (nút tròn sơn mài góc phải dưới, gắn trong `WeddingPage`; hiện khi đã cuộn quá ~1 màn hình, vòng chỉ vàng = tiến độ đọc trang), `Monogram` (T&V Imperial Script, tuỳ chọn `ring`), `MaiFlower`/`MaiBranch`.
- `src/components/effects/*`: `Intro`; `CustomCursor` (chấm + vòng `mix-blend-difference`, hiện chữ "Xem" khi rê lên `VIEW_SELECTOR` trong `src/lib/cursor.ts`, chỉ bật với chuột thật); `SmoothScroll` (Lenis `lerp: 0.18`, mặc định 0.1 làm trang trôi trễ sau tay cuộn, trên trackpad Mac cảm giác như lag; đăng ký instance vào `src/lib/scroll.ts` để `scrollToTop()` cuộn cùng nhịp Lenis).
- `src/lib/*`: hàm thuần (date theo giờ VN, `device` (fine pointer), `motion`, `cn`, `calendar`, `intro`, `pen`, `heart-line`, `scroll`, `og`); `src/hooks/*`: `useCountdown`, `useInView`.
- Không dùng barrel `index.ts`.

## Quy ước

- Hiệu năng: keyframe CSS không dùng `var()` (buộc animation chạy trên luồng chính thay vì GPU). Video tự phát phải qua `AutoplayVideo`.
- Mọi hiệu ứng tôn trọng reduced-motion (`MotionConfig reducedMotion="user"`, hoặc `useReducedMotion` để có trạng thái tĩnh đầy đủ).
- Hiệu ứng 3D bằng CSS: thẻ cha có `opacity`/`filter`/`overflow`/`clip-path` sẽ làm phẳng `preserve-3d`, nên đặt mấy thuộc tính đó ở lớp bọc ngoài hoặc ở lá con.
- Không dùng hiệu ứng gương/chrome CSS (đã thử và bỏ theo ý chủ dự án).
- Prettier đổi file sang CRLF trên Windows (autocrlf), nên `git status` có thể báo M ở file không đổi nội dung. Chỉ commit thay đổi thật.

## Skills (`.claude/skills`)

- Cài bằng `npx skills` (theo dõi trong `skills-lock.json`): `threejs-*` (CloudAI-X/threejs-skills), `gsap-*` (greensock/gsap-skills, chính chủ)
- Chép tay từ MengTo/Skills (MIT, không có trong lock, cập nhật thủ công, đã bỏ ảnh demo): `no-ai-design-slop`, `gsap-scrolltrigger-storytelling`, `scroll-progress-timeline`, `staggered-word-reveal`
- Có sẵn trước: `frontend-design`, `ui-ux-pro-max`, `senior-frontend` (gần như rỗng, chỉ là template)
- Chủ dự án muốn áp dụng các skill này khi làm giao diện (đặc biệt `no-ai-design-slop`, `frontend-design`).

## Trạng thái

- Ngày: `wedding.date` = 14/02/2027 08:00 (Lễ Tân Hôn, trùng Valentine). Sự kiện: Lễ Vu Quy 13/02/2027 08:00 (nhà gái, mùng 8 tháng Giêng), Lễ Tân Hôn 14/02/2027 08:00 (nhà trai, mùng 9 tháng Giêng), Tết Đinh Mùi 6/2/2027. Địa chỉ, link bản đồ, tên bố mẹ, địa chỉ hai nhà, thứ bậc còn là dữ liệu mẫu.
- Lịch sử thiết kế: bản đầu GenZ pastel Y2K (chibi, nhẫn 3D, hoa rơi, dây ảnh hai bên, nền đổi màu). Chủ dự án chọn đổi sang sang trọng "Sơn Mài & Ngà" (vẫn giữ không khí xuân miền Tây). Đã xoá toàn bộ phần cũ: `three/*`, chibi (`Chibi`, `Couple`, `TrayBearer`), `FallingPetals`, `HangingPhotos`, `PhotoLine`, `PageBackdrop`, `Garland`, `GradientMesh`, `sticker`, `Ticket`, `useCan3D`, `lib/confetti`, `.y2k-type`. Nhẫn 3D ở Hero đã thay bằng ảnh chân dung khung vòm.
- Album đang dùng DỮ LIỆU MẪU: `src/data/sample-gallery.ts` (18 ảnh Unsplash/picsum + 2 video tự dựng) trong `public/images/gallery/sample`, `public/videos/sample` (nguồn: `CREDITS.md`). Ảnh Hero cũng lấy từ đây. Thay bằng ảnh thật trước khi ra mắt.
- Còn thô / TODO: lightbox PhotoSwipe cho Gallery. Chưa có: RSVP / sổ lưu bút, nhạc nền, ảnh thật.
- Câu hỏi đang chờ chủ dự án trả lời: merge `redesign/luxury` vào `main`? (đã chốt: đổi hashtag, dùng `SignatureNames` cho Hero/OG, gỡ thư viện thừa)
- Tailwind v4 nạp qua `@tailwindcss/postcss` (`postcss.config.mjs`), theo docs Next 16. Đã bỏ loader `@tailwindcss/turbopack` vì nó làm Turbopack cache giữ `globals.css` cũ. Nếu CSS không cập nhật: tắt dev, `rm -rf .next`, chạy lại.
- Git: remote `origin` = github.com/DangLun/vinh-trinh-wedding. `main` = bản GenZ cũ; `redesign/luxury` = bản sang trọng (chủ dự án đã tự push một lần ở commit 1794988; phần sửa sau đó chưa commit). Chỉ commit/push khi được yêu cầu.
