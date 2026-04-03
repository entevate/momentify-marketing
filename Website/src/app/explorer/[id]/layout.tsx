import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Momentify Explorer',
};

export const viewport: Viewport = {
  width: 1366,
  initialScale: 1,
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
