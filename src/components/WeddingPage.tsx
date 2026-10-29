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
import { guestEvents, inviteeLabel } from "@/lib/guests";
import type { Guest } from "@/types/guest";

/** Trang cưới. Có `guest` (link mời riêng) thì lời chào, lễ được mời, đếm ngược theo khách đó. */
export default function WeddingPage({ guest }: { guest?: Guest }) {
  const events = guestEvents(guest);
  return (
    // overflow-x-clip: ảnh treo được phép tràn mép màn hình mà không tạo thanh cuộn ngang
    <main className="relative overflow-x-clip">
      <PageBackdrop />
      <HangingPhotos />
      <Hero
        guestName={guest && inviteeLabel(guest)}
        date={guest ? events[0].time : undefined}
      />
      <Marquee />
      <Countdown target={guest ? events[0].time : undefined} />
      <PhotoLine line={0} />
      <LoveStory />
      <PhotoLine line={1} />
      <EventInfo events={events} guestName={guest?.name} />
      <Gallery />
      <Footer guestName={guest?.name} />
      <FallingPetals />
    </main>
  );
}
