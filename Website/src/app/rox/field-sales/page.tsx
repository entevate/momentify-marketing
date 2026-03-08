import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FieldSalesROXCalculator from "@/components/rox/FieldSalesROXCalculator";

export const metadata = {
  title: "Field Sales ROX™ Calculator | Momentify",
  description:
    "Calculate your Field Sales ROX™ score across interaction capture, content engagement, follow-up speed, and deal progression. See where your field team stands.",
};

export default function FieldSalesROXPage() {
  return (
    <main>
      <Navigation />
      <FieldSalesROXCalculator />
      <Footer />
    </main>
  );
}
