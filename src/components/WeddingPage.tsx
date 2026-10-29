import Countdown from "@/components/sections/Countdown";
import EventInfo from "@/components/sections/EventInfo";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import Marquee from "@/components/sections/Marquee";
import { BackToTop } from "@/components/ui/BackToTop";
import { guestEvents, inviteeLabel } from "@/lib/guests";
import type { Guest } from "@/types/guest";

/** Trang cưới. Có `guest` (link mời riêng) thì lời chào, lễ được mời, đếm ngược theo khách đó. */
export default function WeddingPage({ guest }: { guest?: Guest }) {
  const events = guestEvents(guest);
  return (
    <main className="relative overflow-x-clip">
      <Hero
        guestName={guest && inviteeLabel(guest)}
        date={guest ? events[0].time : undefined}
      />
      <Marquee />
      <Countdown target={guest ? events[0].time : undefined} />
      <LoveStory />
      <EventInfo events={events} guestName={guest?.name} />
      <Gallery />
      <Footer guestName={guest?.name} />
      <BackToTop />
    </main>
  );
}
