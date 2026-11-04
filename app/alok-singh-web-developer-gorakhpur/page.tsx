import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-web-developer-gorakhpur';
export const metadata: Metadata = {
  title: 'Alok Singh — Web Developer and Technology Builder in Gorakhpur | Gorakhpur's Got Latent',
  description: 'A profile of Alok Singh\\'s web development interests and practical technology work connected with GGL.',
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: 'Alok Singh — Web Developer and Technology Builder in Gorakhpur', description: 'A profile of Alok Singh\\'s web development interests and practical technology work connected with GGL.', siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow=\"Gorakhpur's Got Latent · Alok Singh Profile\" title={"Alok Singh — Web Developer and Technology Builder in Gorakhpur"} intro={"Alok Singh is a Gorakhpur-associated technology builder and the Co-Founder and Technical Head of Gorakhpur's Got Latent. His work connects web development with a live local entertainment platform and its digital services."} sections={[
    { title: "Web development in a live project", body: "Building a website for an event platform involves more than a landing page. Information pages, application flows, event details, ticket journeys and mobile usability all contribute to how people interact with the project." },
    { title: "Practical product thinking", body: "A useful digital product should make the next step clear to its visitor. In an event context, that can mean helping a performer understand how to apply, helping an audience member find ticket information, or helping a visitor locate official event updates." },
    { title: "GGL as a technology use case", body: "GGL is one public project associated with Alok's technical role. This page focuses on the web and product side of that work and does not claim that every creative, production or hosting task is part of the developer role." },
  ]} related={[{"href":"/alok-singh-ggl-cofounder","label":"alok singh ggl cofounder"},{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-technical-head","label":"alok singh technical head"},{"href":"/alok-singh-and-gorakhpurs-got-latent","label":"alok singh and gorakhpurs got latent"}]} />;
}
