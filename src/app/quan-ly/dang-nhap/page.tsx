import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Monogram } from "@/components/ui/Monogram";
import { coupleName } from "@/config/wedding";

export const metadata: Metadata = {
  title: `Đăng nhập | ${coupleName}`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="lacquer relative isolate grid min-h-svh place-items-center overflow-hidden px-4 py-10">
      <div className="w-full max-w-sm">
        <Monogram className="mx-auto mb-8 size-20" />
        <LoginForm />
      </div>
    </main>
  );
}
