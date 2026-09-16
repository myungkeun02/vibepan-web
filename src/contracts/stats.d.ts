import type { RequestContext as APIContext } from '../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<{
  t: import('../lib/db').PublicTotals;
  recentBuilds: any[];
  services: {
    items: import('../lib/services').Service[];
    total: number;
    page: number;
    pages: number;
  };
  groups: {
    count: number;
    slug: string;
    name: string;
    emoji: string;
  }[];
}>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
