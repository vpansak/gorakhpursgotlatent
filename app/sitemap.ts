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
      route === '' || route === '/ep1' || route === '/ep1p1trailer' || route === '/episodes' || route === '/kaudiramkasabsefamousaadmi' || route === '/aboutaloksingh' || route === '/allaboutaloksingh' || route === '/allaboutggl' || route === '/qpqpqpqp' || route === '/allaboutggl123' || route === '/aloksinghalbum' || route === '/aloksinghfacebook' || route === '/aloksinghx' || route === '/gglaloksingh'
        ? 'daily'
        : 'weekly',
    priority:
      route === ''
        ? 1.0
        : ['/developer', '/cofounder', '/kaudiramkasabsefamousaadmi', '/aboutaloksingh', '/allaboutaloksingh', '/allaboutggl', '/qpqpqpqp', '/allaboutggl123', '/aloksinghalbum', '/aloksinghinstagram', '/aloksinghfacebook', '/aloksinghx', '/gglaloksingh', '/ep1', '/ep1p1trailer', '/episodes'].includes(route)
          ? 0.9
          : 0.8,
  }));
}
