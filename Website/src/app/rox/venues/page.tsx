import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventsVenuesROXCalculator from "@/components/rox/EventsVenuesROXCalculator";

export const metadata = {
  title: "Venues & Events ROX™ Calculator | Momentify",
  description:
    "Calculate your Venues & Events ROX™ score across attendee capture, engagement quality, follow-up speed, and sponsor conversion. See where your events stand.",
};

export default function EventsVenuesROXPage() {
  return (
    <main>
      <Navigation />
      <EventsVenuesROXCalculator />
      <Footer />
    </main>
  );
}
