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
      e: import('../../../lib/services').ServiceEdit | null;
    }
>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
