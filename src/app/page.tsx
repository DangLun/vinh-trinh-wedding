import Intro from "@/components/effects/Intro";
import WeddingPage from "@/components/WeddingPage";

// Màn mở đầu chỉ ở trang chung: link mời riêng (/m/…) đã có phong bì làm mở màn
export default function Home() {
  return (
    <>
      <Intro />
      <WeddingPage />
    </>
  );
}
