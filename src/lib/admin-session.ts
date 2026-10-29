import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Phiên đăng nhập trang quản lý: cookie "<hạn dùng>.<chữ ký HMAC>".
 * Khoá ký chính là ADMIN_PASSWORD, nên đổi mật khẩu thì mọi phiên cũ tự hết hiệu lực.
 * Chỉ dùng ở server (proxy.ts, Server Action), không import vào client component.
 */
export const SESSION_COOKIE = "vt_admin";
export const SESSION_DAYS = 30;

const adminPassword = () => process.env.ADMIN_PASSWORD;

const sign = (payload: string, key: string) =>
  createHmac("sha256", key).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(given: string) {
  const password = adminPassword();
  return !!password && safeEqual(given, password);
}

export function createSession() {
  const password = adminPassword();
  if (!password) throw new Error("Chưa đặt ADMIN_PASSWORD");
  const expires = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${expires}.${sign(expires, password)}`;
}

export function verifySession(token: string | undefined) {
  const password = adminPassword();
  if (!password || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires, password));
}
