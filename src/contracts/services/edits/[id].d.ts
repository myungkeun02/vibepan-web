import type { RequestContext as APIContext } from '../../../lib/request-context';
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
