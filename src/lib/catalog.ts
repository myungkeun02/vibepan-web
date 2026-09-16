import { getApp, priceLabel } from './apps';
import type { App } from './schema';
import { serviceHref, type Service } from './services';
import { servicePricing } from './service-schema';
import { readResource } from './api-client';
export function catalogApp(s: Service): App | null {
  const base = s.catalog_slug ? getApp(s.catalog_slug) : undefined;
  if (!base || !s.guide) return null;
  const samePricing = s.pricing === base.pricing.model;
  return {
    ...base,
    ...s.guide,
    nameKo: s.name,
    officialUrl: s.website_url,
    category: s.category,
    summary: s.tagline,
    priceMonthly: samePricing ? base.priceMonthly : s.pricing === 'free' ? 0 : null,
    pricing: samePricing
      ? base.pricing
      : {
          ...base.pricing,
          model: s.pricing as App['pricing']['model'],
          plan: '확인 필요',
          billing: 'unknown',
          monthlyNative: null,
          annualMonthlyNative: null,
          oneTimeNative: null,
        },
  };
}
export function catalogEntry(s: Service, counts: Record<string, number> = {}) {
  const base = s.catalog_slug ? getApp(s.catalog_slug) : undefined,
    app = catalogApp(s);
  return {
    ...s,
    slug: s.catalog_slug || s.id,
    nameKo: s.name,
    summary: s.tagline,
    href: serviceHref(s),
    originalName: base?.name,
    aliases: base ? [base.name, ...base.aliases, ...base.tags] : [],
    types: base?.types || ['saas'],
    verdict: s.guide?.verdict || null,
    checkedOn: s.revision > 1 ? s.updated_at : base?.checkedOn || s.published_at || s.created_at,
    priceMonthly: app ? app.priceMonthly : s.pricing === 'free' ? 0 : null,
    pricingLabel: app ? priceLabel(app) : servicePricing[s.pricing],
    reviewCount: counts[s.catalog_slug || s.id] || 0,
  };
}
export type CatalogEntry = ReturnType<typeof catalogEntry>;
export const catalog = (
  params = new URLSearchParams(),
  size = 20,
): Promise<{
  items: CatalogEntry[];
  all: CatalogEntry[];
  total: number;
  page: number;
  pages: number;
  categories: Record<string, number>;
}> => readResource('catalog', { query: params.toString(), size });
