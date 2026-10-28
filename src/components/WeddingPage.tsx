import Countdown from "@/components/sections/Countdown";
import EventInfo from "@/components/sections/EventInfo";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import Marquee from "@/components/sections/Marquee";

export default function WeddingPage({ guestName }: { guestName?: string }) {
  return (
    <main>
      <Hero guestName={guestName} />
      <Marquee />
      <Countdown />
      <LoveStory />
      <EventInfo />
      <Gallery />
      <Footer />
    </main>
  );
}
