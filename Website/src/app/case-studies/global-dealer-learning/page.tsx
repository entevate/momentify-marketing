import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalDealerLearningCaseStudy from "@/components/case-studies/GlobalDealerLearningCaseStudy";

export const metadata = {
  title: "Global Dealer Learning Case Study | Momentify",
  description:
    "How Caterpillar's Global Dealer Learning group used Momentify to unify technician recruiting across SkillsUSA and FFA, routing qualified candidates to 40 dealers in real time.",
};

export default function GlobalDealerLearningPage() {
  return (
    <main>
      <Navigation />
      <GlobalDealerLearningCaseStudy />
      <Footer />
    </main>
  );
}
