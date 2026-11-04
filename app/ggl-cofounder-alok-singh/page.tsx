import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = "https://www.gkpgotlatent.in/ggl-cofounder-alok-singh";
export const metadata: Metadata = {
  title: "GGL Co-Founder Alok Singh — Official Profile | Gorakhpur's Got Latent",
  description: "Official profile page about Alok Singh's co-founder position at Gorakhpur's Got Latent and his role in the team.",
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: "GGL Co-Founder Alok Singh — Official Profile", description: "Official profile page about Alok Singh's co-founder position at Gorakhpur's Got Latent and his role in the team.", siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow={"Gorakhpur's Got Latent · Alok Singh Profile"} title={"GGL Co-Founder Alok Singh — Official Profile"} intro={"Alok Singh is the Co-Founder, Computerji and Technical Head of Gorakhpur's Got Latent (GGL). This page provides a concise reference for people searching for the GGL Co-Founder and his responsibilities."} sections={[
    { title: "Co-Founder of GGL", body: "The Co-Founder title identifies Alok Singh as part of the founding team of Gorakhpur's Got Latent. His role is focused on the platform's technical side and digital presence." },
    { title: "Working alongside the Founder and Host", body: "Naveen Varma is GGL's Founder and Host. Alok Singh is the Co-Founder and Technical Head. The two profiles describe separate roles within the same project." },
    { title: "Official source", body: "This profile is published on the GGL domain. It should be read alongside the main Co-Founder profile and the site's current event information. Search engines may take time to discover and index new pages." },
  ]} related={[{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"},{"href":"/alok-singh-ggl-cofounder","label":"Official GGL Co-Founder profile"},{"href":"/aboutaloksingh","label":"Alok Singh biography"}]} />;
}
