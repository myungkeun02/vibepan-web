import type { RequestContext as APIContext } from '../lib/request-context';
export declare function load(
  Astro: APIContext & {
    response: {
      status: number;
    };
  },
): Promise<
  | Response
  | {
      user: any;
      mine: any[];
      comments: any[];
      saved: (
        | {
            slug: string;
            name: string;
            nameKo: string;
            aliases: string[];
            domain: string;
            category: string;
            summary: string;
            officialUrl: string;
            tags: string[];
            types: ('saas' | 'desktop' | 'local-first' | 'open-source')[];
            platforms: string[];
            priceMonthly: number | null;
            pricing: {
              model: 'free' | 'freemium' | 'subscription' | 'one-time' | 'usage-based' | 'contact-sales';
              currency: string;
              plan: string;
              perSeat: boolean;
              minimumSeats: number;
              billing: 'unknown' | 'free' | 'one-time' | 'monthly' | 'annual' | 'annual-monthly' | 'prepaid';
              quoteOnly?: boolean;
              periodDays?: number;
              monthlyNative: number | null;
              annualMonthlyNative: number | null;
              oneTimeNative: number | null;
              source: {
                url: string;
                checkedOn: string;
                status: 'verified' | 'unverified';
                note: string;
              };
              exchange: {
                rate: number;
                date: string;
                source: string;
              } | null;
            };
            verdict: 'yes' | 'kinda' | 'no';
            verdictReason: string;
            checkedOn: string;
            verification: 'editorial';
            scope: string;
            features: string[];
            difficulty: '입문' | '중급' | '고급';
            whatYouLose: string[];
            operations: string[];
            dependencies: string[];
            priorArt: {
              name: string;
              url: string;
              license: string;
              licenseUrl: string | null;
              verified: boolean;
            }[];
            relatedSlugs: string[];
            prompt: string;
            promptVersion: string;
            history: {
              version: string;
              date: string;
              note: string;
            }[];
            notes: string;
            faq: {
              q: string;
              a: string;
            }[];
            sources: {
              url: string;
              checkedOn: string;
              status: 'verified' | 'unverified';
              note: string;
            }[];
            published: boolean;
          }
        | undefined
      )[];
      voted: any[];
      savedPosts: any[];
      suggestions: any[];
      services: any[];
      serviceEdits: any[];
      labels: Record<string, string>;
    }
>;

export type PageData = Exclude<Awaited<ReturnType<typeof load>>, Response>;
