import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RecruitingROXCalculator from "@/components/rox/RecruitingROXCalculator";

export const metadata = {
  title: "Technical Recruiting ROX\u2122 Calculator | Momentify",
  description:
    "Calculate your Technical Recruiting ROX\u2122 score across candidate capture, engagement quality, follow-up speed, and conversion to hire. See where your recruiting events stand.",
};

export default function RecruitingROXPage() {
  return (
    <main>
      <Navigation />
      <RecruitingROXCalculator />
      <Footer />
    </main>
  );
}
