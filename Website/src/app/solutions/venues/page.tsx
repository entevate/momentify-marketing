import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventsVenuesSolution from "@/components/solutions/EventsVenuesSolution";

export const metadata = {
  title: "Venues and Events | Momentify",
  description:
    "The engagement platform between the gate and the recap. See how Momentify helps event teams capture attendee engagement, attribute sponsor value, and follow up while the moment still matters.",
};

export default function EventsVenuesPage() {
  return (
    <main>
      <Navigation />
      <EventsVenuesSolution />
      <Footer />
    </main>
  );
}
