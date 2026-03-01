import type { Metadata } from "next";
import HowItWorksContent from "@/components/HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works | Momentify Platform",
  description:
    "Three steps from setup to intelligence. See how Momentify captures, contextualizes, and proves the value of every in-person interaction.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
