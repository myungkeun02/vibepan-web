import type { RequestContext as APIContext } from '../../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<{
  r: {
    items: any[];
    total: any;
    page: number;
    pages: number;
  };
}>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
