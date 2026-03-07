import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TechRecruitingSolution from "@/components/solutions/TechRecruitingSolution";

export const metadata = {
  title: "Technical Recruiting | Momentify",
  description:
    "Your recruiting events deserve more than a stack of resumes. See how Momentify helps recruiting teams capture candidate intent, score by fit, and follow up before top talent accepts somewhere else.",
};

export default function TechRecruitingPage() {
  return (
    <main>
      <Navigation />
      <TechRecruitingSolution />
      <Footer />
    </main>
  );
}
