/**
 * Địa chỉ gốc của trang, dùng cho link tuyệt đối (ảnh xem trước Zalo/Facebook, mã QR).
 * Ưu tiên NEXT_PUBLIC_SITE_URL; trên Vercel tự lấy tên miền production; chạy máy thì localhost.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
