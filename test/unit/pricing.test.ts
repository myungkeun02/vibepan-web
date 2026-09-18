import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { apps, getApp } from '../../src/lib/apps';
import { priceLabel } from '../../src/lib/pricing';

describe('verified catalog pricing', () => {
  test('keeps native currency and billing conditions visible', () => {
    expect(priceLabel(getApp('notion')!)).toBe('US$12/인·월');
    expect(priceLabel(getApp('figma')!)).toBe('US$16/인·월 · 연 결제');
    expect(priceLabel(getApp('photoshop')!)).toBe('₩30,800/월 · 연 약정');
    expect(priceLabel(getApp('hancom-office')!)).toBe('₩99,000 · 한 번 구매');
    expect(priceLabel(getApp('photopea')!)).toBe('€15 / 90일');
    expect(priceLabel(getApp('mattermost')!)).toBe('요금 문의');
    expect(priceLabel(getApp('microsoft-forms')!)).toBe('무료');
  });
  test('does not reuse a verified price after its evidence is invalidated', () => {
    const a = getApp('notion')!;
    expect(
      priceLabel({ pricing: { ...a.pricing, source: { ...a.pricing.source, status: 'unverified' } } }),
    ).toBe('가격 확인 필요');
  });
  test('all published tools have verified prices or an explicit quote and a local icon', () => {
    const icons = JSON.parse(readFileSync('data/icons.json', 'utf8'));
    for (const a of apps) {
      expect(a.pricing.source.status, a.slug).toBe('verified');
      expect(priceLabel(a), a.slug).not.toBe('가격 확인 필요');
      expect(existsSync('public' + icons[a.slug]?.src), a.slug).toBe(true);
      if (a.pricing.billing === 'one-time' || a.pricing.quoteOnly) expect(a.priceMonthly).toBeNull();
      if (a.pricing.perSeat) expect(a.pricing.minimumSeats).toBeGreaterThanOrEqual(1);
    }
  });
});
