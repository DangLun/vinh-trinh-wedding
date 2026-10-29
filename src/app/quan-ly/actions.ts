"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSession,
  SESSION_COOKIE,
  SESSION_DAYS,
} from "@/lib/admin-session";

/** `attempt` tăng mỗi lần sai để giao diện biết mà lắc thẻ, kể cả khi lỗi giống lần trước */
export type LoginState = { error?: string; attempt: number };

export async function login(
  prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!process.env.ADMIN_PASSWORD) {
    return {
      error:
        "Chưa cài mật khẩu (ADMIN_PASSWORD trong .env.local hoặc trên Vercel).",
      attempt: prev.attempt + 1,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Chờ một nhịp trước khi báo sai để làm chậm việc dò mật khẩu
    await new Promise((r) => setTimeout(r, 800));
    return {
      error: "Sai mật khẩu rồi, thử lại nha!",
      attempt: prev.attempt + 1,
    };
  }

  (await cookies()).set(SESSION_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/quan-ly",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/quan-ly");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/quan-ly" });
  redirect("/quan-ly/dang-nhap");
}
