import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Momentify Explorer',
};

export const viewport: Viewport = {
  width: 1366,
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
