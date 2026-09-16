import { categoryName } from './apps';
import { servicePricing, type ServiceGuide } from './service-schema';
import { readResource } from './api-client';
export interface Service {
  id: string;
  user_id: string | null;
  catalog_slug: string | null;
  name: string;
  website_url: string;
  url_key: string;
  category: string;
  tagline: string;
  description: string;
  pricing: string;
  relationship: 'maker' | 'user';
  image_id: string | null;
  guide: ServiceGuide | null;
  status: string;
  review_note: string;
  revision: number;
  nickname: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  account_status?: string;
  catalog_active?: number;
}
export type ServiceContent = ReturnType<typeof serviceContent>;
export interface ServiceEdit {
  id: string;
  service_id: string;
  user_id: string;
  base_revision: number;
  before_data: ServiceContent;
  after_data: ServiceContent;
  reason: string;
  status: string;
  review_note: string;
  created_at: string;
  reviewed_at: string | null;
  nickname?: string;
  name?: string;
  catalog_slug?: string | null;
}
export const serviceHref = (s: Pick<Service, 'id' | 'catalog_slug'>) =>
  s.catalog_slug ? '/' + s.catalog_slug : '/services/' + s.id;
export function serviceContent(s: Service) {
  return {
    name: s.name,
    website: s.website_url,
    category: s.category,
    tagline: s.tagline,
    description: s.description,
    pricing: s.pricing,
    relationship: s.relationship,
    image: s.image_id ? '/media/' + s.image_id : '',
    guide: s.guide,
  };
}
export function contentChanges(before: ServiceContent, after: ServiceContent) {
  const fields: Record<string, string> = {
    name: '서비스 이름',
    website: '서비스 주소',
    category: '분야',
    tagline: '한 줄 소개',
    description: '상세 소개',
    pricing: '요금 방식',
    image: '이미지',
  };
  const display = (key: string, v: any) =>
    v === null
      ? '없음'
      : key === 'category'
        ? categoryName(v)
        : key === 'pricing'
          ? servicePricing[v] || v
          : String(v || '없음');
  const result = Object.entries(fields)
    .filter(([key]) => JSON.stringify((before as any)[key]) !== JSON.stringify((after as any)[key]))
    .map(([key, label]) => ({
      key,
      label,
      before: display(key, (before as any)[key]),
      after: display(key, (after as any)[key]),
    }));
  const guideFields: Record<string, string> = {
    scope: '제작 범위',
    verdict: '대체 가능성',
    verdictReason: '판단 이유',
    difficulty: '제작 난이도',
    features: '만들 기능',
    whatYouLose: '제외할 기능',
    operations: '운영 시 필요한 것',
    prompt: '제작 프롬프트',
  };
  const format = (key: string, v: any) =>
    Array.isArray(v)
      ? v.join('\n')
      : key === 'verdict'
        ? ({ yes: '대체 가능', kinda: '일부 대체 가능', no: '대체 어려움' } as any)[v] || '없음'
        : String(v || '없음');
  for (const [key, label] of Object.entries(guideFields)) {
    const b = (before.guide as any)?.[key],
      a = (after.guide as any)?.[key];
    if (JSON.stringify(a) !== JSON.stringify(b))
      result.push({ key: 'guide.' + key, label, before: format(key, b), after: format(key, a) });
  }
  return result;
}
export const visibleService = (id: string) => readResource('service', { id });
