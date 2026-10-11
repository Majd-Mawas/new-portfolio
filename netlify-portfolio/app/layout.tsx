import type { Metadata } from 'next';
import { siteUrl } from '@/lib/content';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Majd Mawas — Full-Stack Software Engineer', template: '%s | Majd Mawas' },
  description: 'Reliable applications, thoughtful automation, and production infrastructure. Majd Mawas is a full-stack software engineer working with international teams.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_US', url: siteUrl, siteName: 'Majd Mawas', title: 'Majd Mawas — From Code to Production', description: 'Full-stack applications. Python & n8n automation. Production infrastructure.', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Majd Mawas — Software that works, from code to production.' }] },
  twitter: { card: 'summary_large_image', title: 'Majd Mawas — Full-Stack Software Engineer', images: ['/og-image.png'] },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('majd-theme')==='light'?'light':'dark'}catch(e){}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>; }


