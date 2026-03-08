import type { Metadata } from "next";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import DemoContent from "@/components/DemoContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Schedule a Demo | Momentify",
  description:
    "Request a personalized Momentify demo. See how to capture, score, and prove the ROX of every in-person engagement.",
};

export default function DemoPage() {
  return (
    <main>
      <Navigation />
      <Suspense>
        <DemoContent />
      </Suspense>
      <Footer />
    </main>
  );
}
