import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sq-agriculture.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/products/seeds', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/products/fertilizers-micronutrients', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/products/pesticide', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/products/field-machinery', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/products/service-spare-parts', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/products/pre-owned-machines', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/store-locator', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/promotional-offers', priority: 0.6, changeFrequency: 'weekly' as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
