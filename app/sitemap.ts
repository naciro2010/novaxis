import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BRAND.url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }
  ];
}
