import type { Metadata } from "next";
import SecurityContent from "@/components/SecurityContent";

export const metadata: Metadata = {
  title: "Security | Momentify Platform",
  description:
    "Enterprise-grade security, privacy, and reliability. Momentify protects your data with AES-256 encryption, role-based access, SSO, and SOC 2 compliance.",
};

export default function SecurityPage() {
  return <SecurityContent />;
}
