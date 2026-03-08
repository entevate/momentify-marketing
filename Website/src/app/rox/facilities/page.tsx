import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilitiesROXCalculator from "@/components/rox/FacilitiesROXCalculator";

export const metadata = {
  title: "Facilities ROX™ Calculator | Momentify",
  description:
    "Calculate your Facilities ROX™ score across visitor capture, engagement quality, follow-up speed, and pipeline attribution. See where your facility stands.",
};

export default function FacilitiesROXPage() {
  return (
    <main>
      <Navigation />
      <FacilitiesROXCalculator />
      <Footer />
    </main>
  );
}
