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
      p: any;
      allowed: any;
    }
>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
