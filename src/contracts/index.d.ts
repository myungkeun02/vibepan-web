import type { RequestContext as APIContext } from '../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<{
  recent: any[];
  r: {
    items: {
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
      guide: import('../lib/service-schema').ServiceGuide | null;
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
    total: number;
    page: number;
    pages: number;
    all: {
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
      guide: import('../lib/service-schema').ServiceGuide | null;
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
    categories: {
      [k: string]: number;
    };
  };
  jsonld: (
    | {
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        potentialAction: {
          '@type': string;
          target: string;
          'query-input': string;
        };
        itemListElement?: undefined;
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
        name?: undefined;
        url?: undefined;
        potentialAction?: undefined;
      }
  )[];
}>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
