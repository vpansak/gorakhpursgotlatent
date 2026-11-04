import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-computerji';
export const metadata: Metadata = {
  title: 'Who Is Computerji? — Alok Singh at GGL | Gorakhpur's Got Latent',
  description: 'Learn why Alok Singh is known as Computerji in the Gorakhpur\\'s Got Latent show context and what his technical role means.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Who Is Computerji? — Alok Singh at GGL', description: 'Learn why Alok Singh is known as Computerji in the Gorakhpur\\'s Got Latent show context and what his technical role means.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Who Is Computerji? — Alok Singh at GGL"} intro={"Computerji is the on-show identity associated with Alok Singh at Gorakhpur's Got Latent (GGL). Alok is the platform's Co-Founder and Technical Head, connecting the show's on-screen identity with its digital and technical work."} sections={[
    { title: "Computerji and Alok Singh", body: "In GGL's context, Computerji refers to Alok Singh. The name is used as an identity within the show's presentation; it is not a separate company or a different person." },
    { title: "What the technical head does", body: "The Technical Head role focuses on the digital systems behind the platform: maintaining the website experience, helping structure online registrations and ticket information, and supporting the technical operations that audiences and applicants interact with." },
    { title: "Finding official information", body: "For reliable details, use GGL's official website and its published profile pages. Social handles and third-party pages should be checked against the links published by the person or the organisation." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"},{"href":"/alok-singh-and-gorakhpurs-got-latent","label":"alok singh and gorakhpurs got latent"}]} />;
}
