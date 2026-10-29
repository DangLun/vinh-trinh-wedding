import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-session";

const LOGIN_PATH = "/quan-ly/dang-nhap";

/**
 * Khoá trang quản lý khách mời: chưa đăng nhập thì chuyển sang trang đăng nhập.
 * Mật khẩu ở biến môi trường ADMIN_PASSWORD: ở máy đặt trong .env.local,
 * trên Vercel ở Settings → Environment Variables. Chưa đặt thì không ai vào được.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    // Đã đăng nhập mà mở lại trang đăng nhập thì vào thẳng trang quản lý
    return loggedIn
      ? NextResponse.redirect(new URL("/quan-ly", request.url))
      : NextResponse.next();
  }
  if (loggedIn) return NextResponse.next();
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/quan-ly", "/quan-ly/:path*"],
};
