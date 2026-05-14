import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Venue from "@/components/sections/Venue";
import Logistics from "@/components/sections/Logistics";
import Gallery from "@/components/sections/Gallery";
import RSVP from "@/components/sections/RSVP";
import GiftRegistry from "@/components/sections/GiftRegistry";
import Guestbook from "@/components/sections/Guestbook";

export default function Home() {
  return (
    <main>
      <Hero />
      <Timeline />
      <Venue />
      <Logistics />
      <Gallery />
      <RSVP />
      <GiftRegistry />
      <Guestbook />
    </main>
  );
}