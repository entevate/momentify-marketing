import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HowItWorksContent from "@/components/HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works | Momentify Platform",
  description:
    "Four steps. One platform. Every interaction measured. See how Momentify Web, Explorer, Intelligence, and Engage work together to capture, score, and prove the value of every in-person interaction.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Navigation />
      <HowItWorksContent />
    </main>
  );
}
