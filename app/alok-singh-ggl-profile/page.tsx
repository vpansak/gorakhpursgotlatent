import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-ggl-profile';
export const metadata: Metadata = {
  title: 'Alok Singh — GGL Co-Founder Profile and Public Information | Gorakhpur's Got Latent',
  description: 'A central reference page bringing together public information about Alok Singh, Computerji and his work with GGL.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Alok Singh — GGL Co-Founder Profile and Public Information', description: 'A central reference page bringing together public information about Alok Singh, Computerji and his work with GGL.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Alok Singh — GGL Co-Founder Profile and Public Information"} intro={"This profile brings together public, project-related information about Alok Singh. On Gorakhpur's Got Latent, he is identified as Co-Founder, Computerji and Technical Head. The page is intended to help visitors find the relevant official information in one place."} sections={[
    { title: "Identity and role", body: "Alok Singh is the person associated with the Computerji identity in GGL. His stated roles are Co-Founder and Technical Head. Naveen Varma is separately identified as GGL's Founder and Host." },
    { title: "Project and technology", body: "Alok's GGL-related work is focused on the website and supporting digital experience. For current features, event information and application details, refer to the live official pages rather than relying on old search snippets." },
    { title: "Public profile links", body: "The GGL profile pages link to Alok Singh's public social profiles where available. A profile link is a reference to an external account and does not imply that every account is independently verified by Google." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"}]} />;
}
