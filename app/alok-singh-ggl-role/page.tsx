import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-ggl-role';
export const metadata: Metadata = {
  title: 'Alok Singh\\'s Role at Gorakhpur\\'s Got Latent | Gorakhpur's Got Latent',
  description: 'A clear overview of Alok Singh\\'s Co-Founder, Computerji and Technical Head responsibilities at Gorakhpur\\'s Got Latent.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Alok Singh\\'s Role at Gorakhpur\\'s Got Latent', description: 'A clear overview of Alok Singh\\'s Co-Founder, Computerji and Technical Head responsibilities at Gorakhpur\\'s Got Latent.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Alok Singh's Role at Gorakhpur's Got Latent"} intro={"This page explains Alok Singh's role within Gorakhpur's Got Latent (GGL), the Gorakhpur-based talent and entertainment platform. Alok Singh is the Co-Founder, known on the show as Computerji, and leads the technical side of the platform."} sections={[
    { title: "Role and team structure", body: "GGL's public team description distinguishes the leadership roles: Naveen Varma is the Founder and Host, while Alok Singh is the Co-Founder, Computerji and Technical Head. The titles describe different responsibilities and should not be treated as interchangeable." },
    { title: "Technical contribution", body: "Alok's technical remit includes the official website and its digital experience, online information architecture, registration and ticketing journeys, and supporting technology used to run the platform. This page describes the role at a high level rather than claiming ownership of every production or creative decision." },
    { title: "About this profile", body: "This is an informational profile published by the GGL website. For current event dates, ticket terms and application details, visitors should use the relevant live GGL pages because event information can change." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"},{"href":"/alok-singh-and-gorakhpurs-got-latent","label":"alok singh and gorakhpurs got latent"}]} />;
}
