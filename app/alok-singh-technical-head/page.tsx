import type { Metadata } from 'next';
import AlokSeoProfilePage from '../_components/alok-seo-profile-page';

const pageUrl = "https://www.gkpgotlatent.in/alok-singh-technical-head";
export const metadata: Metadata = {
  title: "Alok Singh — Technical Head of Gorakhpur's Got Latent | Gorakhpur's Got Latent",
  description: "An overview of Alok Singh's technical leadership, website work and digital platform responsibilities for GGL.",
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'profile', url: pageUrl, title: "Alok Singh — Technical Head of Gorakhpur's Got Latent", description: "An overview of Alok Singh's technical leadership, website work and digital platform responsibilities for GGL.", siteName: "Gorakhpur's Got Latent", locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }] },
};

export default function Page() {
  return <AlokSeoProfilePage eyebrow={"Gorakhpur's Got Latent · Alok Singh Profile"} title={"Alok Singh — Technical Head of Gorakhpur's Got Latent"} intro={"Alok Singh serves as the Technical Head and Co-Founder of Gorakhpur's Got Latent. His work is associated with the website, digital platform structure and technical user journeys that support the talent and entertainment project."} sections={[
    { title: "Website and digital experience", body: "A public event platform needs clear information, accessible pages and reliable user journeys. Alok's technical work is associated with the GGL website and the systems through which visitors learn about the show, explore opportunities and access event information." },
    { title: "Registration and ticket journeys", body: "Online application and ticketing experiences require understandable steps and accurate information. The Technical Head role includes work on these digital journeys and the supporting implementation, subject to the current features published on the site." },
    { title: "Technical leadership is distinct from hosting", body: "Naveen Varma is identified as GGL's Founder and Host. Alok Singh's role is Co-Founder and Technical Head. The distinction helps visitors understand who is responsible for the on-stage hosting identity and who leads technical work." },
  ]} related={[{"href":"/alok-singh-ggl-role","label":"alok singh ggl role"},{"href":"/alok-singh-computerji","label":"alok singh computerji"},{"href":"/alok-singh-web-developer-gorakhpur","label":"alok singh web developer gorakhpur"},{"href":"/alok-singh-and-gorakhpurs-got-latent","label":"alok singh and gorakhpurs got latent"},{"href":"/alok-singh-ggl-cofounder","label":"Official GGL Co-Founder profile"},{"href":"/aboutaloksingh","label":"Alok Singh biography"}]} />;
}
