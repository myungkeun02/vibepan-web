import type { Metadata } from 'next';
import { brand, absolute } from './config';
export function createMetadata(
  input: { title?: string; description?: string; canonical?: string; og?: string; noindex?: boolean },
  pathname: string,
): Metadata {
  const title = input.title || brand.name;
  const description = input.description || brand.description;
  const url = absolute(input.canonical || pathname);
  const image = absolute(input.og || '/og/default.png');
  return {
    title: title === brand.name ? title : title + ' · ' + brand.name,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'ko_KR', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: input.noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
