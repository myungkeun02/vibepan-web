import type { APIContext } from 'astro';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<
  | Response
  | {
      items: any[];
    }
>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
