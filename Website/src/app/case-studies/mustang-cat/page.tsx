import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MustangCatCaseStudy from "@/components/case-studies/MustangCatCaseStudy";

export const metadata = {
  title: "Mustang Cat Case Study | Momentify",
  description:
    "How Mustang Cat transformed their technical recruiting process with Momentify. From paper sign-ups to a digital pipeline.",
};

export default function MustangCatPage() {
  return (
    <main>
      <Navigation />
      <MustangCatCaseStudy />
      <Footer />
    </main>
  );
}
