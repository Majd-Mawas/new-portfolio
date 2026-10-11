import type { MetadataRoute } from 'next';
import { projects, siteUrl } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: siteUrl, priority: 1 }, { url: `${siteUrl}/resume`, priority: 0.6 }, ...projects.map(project => ({ url: `${siteUrl}/work/${project.slug}`, priority: 0.8 }))]; }
