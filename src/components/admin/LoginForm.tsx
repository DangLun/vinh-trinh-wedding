"use client";

import { motion } from "motion/react";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/quan-ly/actions";
import { button } from "@/components/ui/button";
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
      className="bg-ivory text-ink border-gold/60 relative z-10 border px-6 pt-10 pb-8 sm:px-10"
    >
      <h1 className="text-center font-serif text-4xl leading-tight font-light text-balance">
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
          className="border-ink/30 focus:border-gold-deep w-full border-b bg-transparent py-3 pr-14 pl-1 text-base outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="hover:bg-paper absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center rounded-full"
        >
          <EyeIcon open={show} />
        </button>
      </div>

      <p
        id="login-error"
        aria-live="polite"
        className="text-son mt-3 min-h-5 text-center text-sm font-normal"
      >
        {state.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className={button({
          tone: "son",
          className: "mt-2 w-full disabled:opacity-60",
        })}
      >
        {pending ? "Đang mở cửa…" : "Vào quản lý"}
      </button>

      <p className="mt-5 text-center text-xs opacity-60">
        Trang riêng của {coupleName}, khách mời không cần vào đây
      </p>
    </motion.form>
  );
}
