import type { Metadata } from "next";
import FanGalleryContent from "@/components/FanGalleryContent";

export const metadata: Metadata = {
  title: "Fan Photo Gallery | Momentify",
  description:
    "Share your game-day photos and join the live suite gallery. Upload a photo for a chance to win prizes.",
  robots: { index: false, follow: false },
};

export default function FanGalleryPage() {
  return <FanGalleryContent />;
}
