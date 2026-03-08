import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DistribuTECHCaseStudy from "@/components/case-studies/DistribuTECHCaseStudy";

export const metadata = {
  title: "DistribuTECH Case Study | Momentify",
  description:
    "How Caterpillar's Electric Power Division used Momentify to grow trade show leads by 92% over three consecutive years at DistribuTECH.",
};

export default function DistribuTECHPage() {
  return (
    <main>
      <Navigation />
      <DistribuTECHCaseStudy />
      <Footer />
    </main>
  );
}
