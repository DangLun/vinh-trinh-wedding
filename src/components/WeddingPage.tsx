import { sendWish } from "@/app/actions";
import { submitRsvp } from "@/app/m/[code]/actions";
import Countdown from "@/components/sections/Countdown";
import EventInfo from "@/components/sections/EventInfo";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import Marquee from "@/components/sections/Marquee";
import Rsvp from "@/components/sections/Rsvp";
import Wishes from "@/components/sections/Wishes";
import { BackToTop } from "@/components/ui/BackToTop";
import { wedding } from "@/config/wedding";
import { formatDotDate } from "@/lib/date";
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
      {/* Hồi âm chỉ có trên link riêng: biết chắc ai trả lời, không cần khách gõ tên */}
      {guest && (
        <Rsvp
          action={submitRsvp.bind(null, guest.code)}
          code={guest.code}
          name={guest.name}
          self={guest.self}
          formal={!!guest.formal}
          events={events.map((e) => ({
            id: e.id,
            title: e.title,
            date: formatDotDate(e.time),
          }))}
          deadline={formatDotDate(wedding.rsvpBy)}
        />
      )}
      <Gallery />
      {/* Lời chúc chỉ ghi vào sheet; link riêng thì gắn sẵn mã khách, không cần hỏi tên */}
      <Wishes
        action={sendWish.bind(null, guest?.code ?? null)}
        guest={
          guest && {
            name: guest.name,
            self: guest.self,
            formal: !!guest.formal,
          }
        }
      />
      <Footer guestName={guest?.name} />
      <BackToTop />
    </main>
  );
}
