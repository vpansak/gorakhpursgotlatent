import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/computerji-ggl';
export const metadata: Metadata = {
  title: 'Computerji at Gorakhpur\\'s Got Latent — Alok Singh | Gorakhpur's Got Latent',
  description: 'A focused explainer connecting the Computerji identity with Alok Singh\\'s Co-Founder and Technical Head role at GGL.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Computerji at Gorakhpur\\'s Got Latent — Alok Singh', description: 'A focused explainer connecting the Computerji identity with Alok Singh\\'s Co-Founder and Technical Head role at GGL.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Computerji at Gorakhpur's Got Latent — Alok Singh"} intro={"At Gorakhpur's Got Latent, Computerji is the identity associated with Alok Singh. He is the Co-Founder and Technical Head of the Gorakhpur-based talent and entertainment platform."} sections={[
    { title: "The name Computerji", body: "Computerji is used in the GGL show context for Alok Singh. It is a recognisable label for his on-show presence, while his organisational role is Co-Founder and Technical Head." },
    { title: "The work behind the identity", body: "Beyond the show identity, Alok's technical work is associated with GGL's website, online platform and digital processes. The public-facing profile connects the name Computerji with the person and role rather than treating it as a separate organisation." },
    { title: "Related information", body: "Visitors looking for the full biography, co-founder role or developer background can use the related official profile pages linked here." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"}]} />;
}
