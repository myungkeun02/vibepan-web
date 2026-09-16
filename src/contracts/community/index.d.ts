import type { APIContext } from 'astro';
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
