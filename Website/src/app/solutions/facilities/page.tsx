import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilitiesSolution from "@/components/solutions/FacilitiesSolution";

export const metadata = {
  title: "Facilities | Momentify",
  description:
    "The engagement platform that turns facility visits into structured pipeline data. See how Momentify helps facility teams capture interactions, track engagement, and follow up before visitors leave the building.",
};

export default function FacilitiesPage() {
  return (
    <main>
      <Navigation />
      <FacilitiesSolution />
      <Footer />
    </main>
  );
}
