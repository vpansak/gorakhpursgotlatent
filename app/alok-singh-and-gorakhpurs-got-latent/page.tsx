import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-and-gorakhpurs-got-latent';
export const metadata: Metadata = {
  title: 'Alok Singh and Gorakhpur\\'s Got Latent (GGL) | Gorakhpur's Got Latent',
  description: 'Understand the connection between Alok Singh and Gorakhpur\\'s Got Latent, including the team\\'s distinct founder, host and co-founder roles.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Alok Singh and Gorakhpur\\'s Got Latent (GGL)', description: 'Understand the connection between Alok Singh and Gorakhpur\\'s Got Latent, including the team\\'s distinct founder, host and co-founder roles.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Alok Singh and Gorakhpur's Got Latent (GGL)"} intro={"Gorakhpur's Got Latent is a talent and entertainment platform based in Gorakhpur, Uttar Pradesh. Alok Singh is associated with the project as Co-Founder, Computerji and Technical Head."} sections={[
    { title: "How Alok is connected to GGL", body: "Alok Singh is a Co-Founder of GGL and leads its technical side. His work is associated with the official website and the digital systems that support the platform's public-facing activities." },
    { title: "GGL leadership", body: "Naveen Varma is the Founder and Host of Gorakhpur's Got Latent. Alok Singh is the Co-Founder, Computerji and Technical Head. These roles are stated separately to avoid confusion between the show's host and its technical co-founder." },
    { title: "What visitors can find on GGL", body: "The official website publishes information about the platform, events, performer applications and ticketing when available. Visitors should rely on the latest pages on the official domain for current schedules, prices and eligibility." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"}]} />;
}
