import type { Metadata } from "next";
import IntegrationsContent from "@/components/IntegrationsContent";

export const metadata: Metadata = {
  title: "Integrations | Momentify Platform",
  description:
    "Connect Momentify to the tools your team already uses. CRM, ATS, data analysis, productivity, automation, and more.",
};

export default function IntegrationsPage() {
  return <IntegrationsContent />;
}
