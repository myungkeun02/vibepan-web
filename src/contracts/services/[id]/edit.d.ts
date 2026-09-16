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
      s: import('../../../lib/services').Service | null;
      allowed: boolean | null;
    }
>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
