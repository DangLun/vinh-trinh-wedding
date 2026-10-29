"use client";

import { motion } from "motion/react";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/quan-ly/actions";
import { sticker } from "@/components/ui/sticker";
import { coupleName } from "@/config/wedding";

const initial: LoginState = { attempt: 0 };

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

/** Ô nhập mật khẩu duy nhất; sai thì thẻ lắc nhẹ và hiện lời nhắc */
export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  const [show, setShow] = useState(false);

  return (
    <motion.form
      action={action}
      // Đổi key mỗi lần sai để chạy lại hiệu ứng lắc
      key={state.attempt}
      initial={state.attempt ? { x: 0 } : { opacity: 0, y: 24 }}
      animate={
        state.attempt ? { x: [0, -12, 12, -8, 8, -4, 0] } : { opacity: 1, y: 0 }
      }
      transition={{ duration: state.attempt ? 0.45 : 0.5 }}
      className="border-plum relative z-10 rounded-3xl border-2 bg-white px-6 pt-8 pb-6 shadow-[6px_6px_0_var(--plum)] sm:px-8"
    >
      <h1 className="font-display text-center text-3xl leading-tight text-balance">
        Góc nhỏ của cô dâu chú rể
      </h1>
      <p className="mt-2 text-center text-sm opacity-75">
        Nhập mật khẩu để quản lý thiệp mời
      </p>

      <label htmlFor="password" className="sr-only">
        Mật khẩu
      </label>
      <div className="relative mt-6">
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          required
          autoFocus
          autoComplete="current-password"
          placeholder="Mật khẩu"
          aria-invalid={!!state.error}
          aria-describedby="login-error"
          className="border-plum bg-milk focus:ring-lilac/60 w-full rounded-full border-2 py-3 pr-14 pl-5 text-base outline-none focus:ring-4"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="hover:bg-blush absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center rounded-full"
        >
          <EyeIcon open={show} />
        </button>
      </div>

      <p
        id="login-error"
        aria-live="polite"
        className="text-lixi mt-3 min-h-5 text-center text-sm font-semibold"
      >
        {state.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className={sticker({
          tone: "bubblegum",
          className:
            "mt-2 min-h-12 w-full text-base font-semibold transition-transform active:translate-y-px disabled:opacity-60",
        })}
      >
        {pending ? "Đang mở cửa…" : "Vào quản lý ✦"}
      </button>

      <p className="mt-5 text-center text-xs opacity-60">
        Trang riêng của {coupleName}, khách mời không cần vào đây 💌
      </p>
    </motion.form>
  );
}
