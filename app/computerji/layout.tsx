import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Computer Ji — Control Panel | Gorakhpur’s Got Latent",
  description: "Live Operator and Scoring Control Console for Gorakhpur’s Got Latent Computer Ji.",
};

export default function ComputerJiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
