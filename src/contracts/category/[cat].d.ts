import type { RequestContext as APIContext } from '../../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<{
  cat:
    | {
        slug: string;
        name: string;
        emoji: string;
      }
    | undefined;
  params: URLSearchParams;
  list: {
    slug: string;
    nameKo: string;
    summary: string;
    href: string;
    originalName: string | undefined;
    aliases: string[];
    types: ('saas' | 'desktop' | 'local-first' | 'open-source')[];
    verdict: 'yes' | 'kinda' | 'no' | null;
    checkedOn: string;
    priceMonthly: number | null;
    pricingLabel: string;
    reviewCount: number;
    id: string;
    user_id: string | null;
    catalog_slug: string | null;
    name: string;
    website_url: string;
    url_key: string;
    category: string;
    tagline: string;
    description: string;
    pricing: string;
    relationship: 'maker' | 'user';
    image_id: string | null;
    guide: import('../../lib/service-schema').ServiceGuide | null;
    status: string;
    review_note: string;
    revision: number;
    nickname: string | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    account_status?: string;
    catalog_active?: number;
  }[];
  jsonld: (
    | {
        '@context': string;
        '@type': string;
        itemListElement: {
          '@type': string;
          position: number;
          name: string;
          item: string;
        }[];
      }
    | {
        '@context': string;
        '@type': string;
        itemListElement: {
          '@type': string;
          position: number;
          name: string;
          url: string;
        }[];
      }
  )[];
}>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
