import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Khoá trang quản lý khách mời bằng mật khẩu (HTTP Basic Auth của trình duyệt).
 * Mật khẩu đặt ở biến môi trường ADMIN_PASSWORD (Vercel → Settings → Environment Variables),
 * tên đăng nhập gõ gì cũng được. Chạy máy (dev) mà chưa đặt mật khẩu thì cho vào luôn.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("Chưa đặt ADMIN_PASSWORD trên Vercel", {
      status: 503,
    });
  }

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    // "tên:mật khẩu"; mật khẩu có thể chứa dấu ":"
    const given = Buffer.from(decoded.slice(decoded.indexOf(":") + 1));
    const expected = Buffer.from(password);
    if (given.length === expected.length && timingSafeEqual(given, expected)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Cần mật khẩu để xem danh sách khách mời", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Quan ly khach moi", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/quan-ly", "/quan-ly/:path*"],
};
