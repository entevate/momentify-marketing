import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CaseStudiesContent from "@/components/CaseStudiesContent";

export const metadata: Metadata = {
  title: "Case Studies | Momentify",
  description:
    "See how teams use Momentify to capture engagement, prove ROI, and turn every interaction into structured pipeline data.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <Navigation />
      <CaseStudiesContent />
      <Footer />
    </main>
  );
}
