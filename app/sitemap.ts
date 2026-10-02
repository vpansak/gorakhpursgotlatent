import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gkpgotlatent.in';
  
  const routes = [
    '',
    '/founder',
    '/developer',
    '/quick-info',
    '/ep1',
    '/tickets',
    '/apply',
    '/apply/performer',
    '/apply/guest',
    '/apply/sponsor',
    '/apply/join-team',
    '/apply/event-booking',
    '/sponsors',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/ep1' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/developer' || route === '/ep1' ? 0.9 : 0.8,
  }));
}
