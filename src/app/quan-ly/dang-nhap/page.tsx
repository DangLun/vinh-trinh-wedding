import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Bride, Groom } from "@/components/sections/Couple";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { coupleName } from "@/config/wedding";

export const metadata: Metadata = {
  title: `Đăng nhập | ${coupleName}`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden px-4 py-10">
      <GradientMesh />
      <div className="w-full max-w-sm">
        {/* Cô dâu chú rể nắm tay ló lên sau thẻ (phần chân bị thẻ che) */}
        <div aria-hidden className="-mb-16 flex justify-center">
          <Groom className="w-24" />
          <Bride className="-ml-6 w-24" />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
