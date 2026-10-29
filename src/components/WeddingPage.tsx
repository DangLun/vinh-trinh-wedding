import FallingPetals from "@/components/effects/FallingPetals";
import PhotoLine from "@/components/effects/PhotoLine";
import PageBackdrop from "@/components/effects/PageBackdrop";
import HangingPhotos from "@/components/effects/HangingPhotos";
import Countdown from "@/components/sections/Countdown";
import EventInfo from "@/components/sections/EventInfo";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import Marquee from "@/components/sections/Marquee";

export default function WeddingPage({ guestName }: { guestName?: string }) {
  return (
    // overflow-x-clip: ảnh treo được phép tràn mép màn hình mà không tạo thanh cuộn ngang
    <main className="relative overflow-x-clip">
      <PageBackdrop />
      <HangingPhotos />
      <Hero guestName={guestName} />
      <Marquee />
      <Countdown />
      <PhotoLine line={0} />
      <LoveStory />
      <PhotoLine line={1} />
      <EventInfo />
      <Gallery />
      <Footer />
      <FallingPetals />
    </main>
  );
}
