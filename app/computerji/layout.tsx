import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Computer Ji | Gorakhpur’s Got Latent",
  description: "Computer Ji — the official scoring and prediction experience for Gorakhpur’s Got Latent.",
};

export default function ComputerJiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
