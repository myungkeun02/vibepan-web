import type { RequestContext as APIContext } from '../../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<{
  p: any;
  linkedService: import('../../lib/services').Service | null;
  user: any;
  comments: any[];
  build: any;
  reactions: {
    like: boolean;
    bookmark: boolean;
  };
}>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
