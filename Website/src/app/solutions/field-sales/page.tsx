import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FieldSalesSolution from "@/components/solutions/FieldSalesSolution";

export const metadata = {
  title: "Field Sales Enablement | Momentify",
  description:
    "The engagement platform between the conversation and the CRM. See how Momentify helps field sales teams capture interactions, deliver content, and follow up before reps get back on the road.",
};

export default function FieldSalesPage() {
  return (
    <main>
      <Navigation />
      <FieldSalesSolution />
      <Footer />
    </main>
  );
}
