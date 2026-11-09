import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.gkpgotlatent.in';

  const routes = [
    '',
    '/aboutggltowr',
    '/gkptilenttower',
    '/linkdin',
    '/aboutaloksingh',
    '/allaboutaloksingh',
    '/allaboutggl',
    '/qpqpqpqp',
    '/allaboutggl123',
    '/aloksinghalbum',
    '/aloksinghinstagram',
    '/aloksinghfacebook',
    '/aloksinghx',
    '/gglaloksingh',
    '/alok-singh-ggl-cofounder',
    '/alok-singh-ggl-seo',
    '/kaudiramkasabsefamousaadmi',
    '/founder',
    '/developer',
    '/cofounder',
    '/quick-info',
    '/bookmyshow',
    '/printerest',
    '/ep1',
    '/ep2',
    '/ep1p1trailer',
    '/episodes',
    '/Upcomingevents',
    '/allevent',
    '/qwer',
    '/tickets',
    '/apply',
    '/apply/performer',
    '/apply/guest',
    '/apply/sponsor',
    '/apply/join-team',
    '/apply/event-booking',
    '/ggl_talent_trip',
    '/ggl_talent_trip/policy',
    '/ggl_talent_trip/terms-and-conditions',
    '/sponsors',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === '' || route === '/ep1' || route === '/ep1p1trailer' || route === '/episodes' || route === '/kaudiramkasabsefamousaadmi' || route === '/aboutaloksingh' || route === '/allaboutaloksingh' || route === '/allaboutggl' || route === '/qpqpqpqp' || route === '/allaboutggl123' || route === '/aloksinghalbum' || route === '/aloksinghfacebook' || route === '/aloksinghx' || route === '/gglaloksingh' || route === '/alok-singh-ggl-cofounder' || route === '/alok-singh-ggl-seo' || route.startsWith('/alok-singh-ggl-') || route === '/alok-singh-computerji' || route === '/alok-singh-technical-head' || route === '/alok-singh-web-developer-gorakhpur' || route === '/alok-singh-and-gorakhpurs-got-latent' || route === '/ggl-cofounder-alok-singh' || route === '/computerji-ggl' || route === '/alok-singh-ggl-profile'
        ? 'daily'
        : 'weekly',
    priority:
      route === '' || route === '/founder'
        ? 1.0
        : ['/founder', '/developer', '/cofounder', '/kaudiramkasabsefamousaadmi', '/aboutaloksingh', '/allaboutaloksingh', '/allaboutggl', '/qpqpqpqp', '/allaboutggl123', '/aloksinghalbum', '/aloksinghinstagram', '/aloksinghfacebook', '/aloksinghx', '/gglaloksingh', '/alok-singh-ggl-cofounder', '/alok-singh-ggl-seo', '/alok-singh-ggl-role', '/alok-singh-computerji', '/alok-singh-technical-head', '/alok-singh-web-developer-gorakhpur', '/alok-singh-and-gorakhpurs-got-latent', '/ggl-cofounder-alok-singh', '/computerji-ggl', '/alok-singh-ggl-profile', '/ep1', '/ep1p1trailer', '/episodes'].includes(route)
          ? 0.9
          : 0.8,
  }));
}
