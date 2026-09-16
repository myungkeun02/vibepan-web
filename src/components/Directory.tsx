import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import EmptyState from './EmptyState';

import { categories } from '../lib/apps';

import { catalog } from '../lib/catalog';

import ToolRow from './ToolRow';

import MobileDirectory from './MobileDirectory';
export default async function ViewDirectoryastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const { params = ctx.url.searchParams } = props;

  const r = await catalog(params);

  const href = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    p.delete('page');
    value ? p.set(key, value) : p.delete(key);
    return '/?' + p.toString() + '#directory';
  };
  return (
    <>
      <div className={'directory-layout'} id={'directory'}>
        <MobileDirectory params={params} total={r.total} />
        <aside>
          <nav className={'category-nav'} aria-label={'도구 카테고리'}>
            <div className={'eyebrow'}>{'어떤 도구를 만들까요?'}</div>
            <a
              href={href('category', '')}
              className={cn({ active: !params.get('category') })}
              data-filter-link={''}
            >
              {'▦ 모든 도구 '}
              <small>{r.all.length}</small>
            </a>
            {categories.map((c, rowIndex1) => (
              <a
                key={rowIndex1}
                href={href('category', c.slug)}
                className={cn({ active: params.get('category') === c.slug })}
                data-filter-link={''}
              >
                <span>{c.emoji}</span> {c.name} <small>{r.categories[c.slug] || 0}</small>
              </a>
            ))}
          </nav>
        </aside>
        <section className={'directory-main'}>
          <div className={'directory-head'}>
            <h2>
              {'SaaS 목록'}
              <span className={'count-label'}>
                {r.total}
                {'개'}
              </span>
            </h2>
            <a href={'/services/new'} className={'small accent'}>
              {'SaaS 등록하기 +'}
            </a>
          </div>
          <form id={'filters'} className={'filters'} action={'/'}>
            <input type={'hidden'} name={'q'} defaultValue={params.get('q') || ''} />
            <input type={'hidden'} name={'category'} defaultValue={params.get('category') || ''} />
            <Select name={'verdict'} aria-label={'대체 가능성'}>
              <option value={''}>{'대체 가능성 전체'}</option>
              {[
                ['yes', '↗ 대체 가능'],
                ['kinda', '≈ 일부 가능'],
                ['no', '× 대체 어려움'],
              ].map(([k, v], rowIndex2) => (
                <option key={rowIndex2} value={k} selected={params.get('verdict') === k}>
                  {v}
                </option>
              ))}
            </Select>
            <Select name={'type'} aria-label={'도구 유형'}>
              <option value={''}>{'모든 유형'}</option>
              {[
                ['saas', '웹 서비스'],
                ['desktop', '데스크톱'],
                ['local-first', '내 기기 중심'],
                ['open-source', '오픈소스'],
              ].map(([k, v], rowIndex3) => (
                <option key={rowIndex3} value={k} selected={params.get('type') === k}>
                  {v}
                </option>
              ))}
            </Select>
            <Select name={'price'} aria-label={'요금 방식'}>
              <option value={''}>{'요금 방식 전체'}</option>
              {[
                ['free', '무료'],
                ['freemium', '무료+유료'],
                ['subscription', '구독형'],
                ['one-time', '한 번 구매'],
                ['usage-based', '사용한 만큼 결제'],
                ['contact-sales', '견적 문의'],
              ].map(([k, v], rowIndex4) => (
                <option key={rowIndex4} value={k} selected={params.get('price') === k}>
                  {v}
                </option>
              ))}
            </Select>
            <Select name={'guide'} aria-label={'제작 가이드'}>
              <option value={''}>{'가이드 전체'}</option>
              <option value={'available'} selected={params.get('guide') === 'available'}>
                {'가이드 있음'}
              </option>
              <option value={'none'} selected={params.get('guide') === 'none'}>
                {'가이드 없음'}
              </option>
            </Select>
            <Select name={'sort'} aria-label={'정렬'}>
              <option value={'popular'} selected={!params.get('sort') || params.get('sort') === 'popular'}>
                {'후기 많은 순 ↓'}
              </option>
              <option value={'newest'} selected={params.get('sort') === 'newest'}>
                {'최근 확인한 순'}
              </option>
              <option value={'price'} selected={params.get('sort') === 'price'}>
                {'월 비용이 낮은 순'}
              </option>
            </Select>
            <noscript>
              <button type={'submit'}>{'적용'}</button>
            </noscript>
          </form>
          <div className={'tool-table-head'}>
            <span>{'도구 / 카테고리'}</span>
            <span>{'이용 비용'}</span>
            <span>{'대체 가능성'}</span>
            <span>{'제작 후기'}</span>
          </div>
          <div aria-live={'polite'} aria-label={'검색 결과'}>
            {r.items.map((a) => (
              <ToolRow entry={a} />
            ))}
            {!r.items.length && (
              <EmptyState>
                <>
                  <h3>{'검색 조건에 맞는 도구가 없어요.'}</h3>
                  <p>{'다른 이름으로 검색하거나 새로운 도구를 제안해 주세요.'}</p>
                  <a href={'/services/new'} className={'button secondary'}>
                    {'\n                SaaS 등록하기\n              '}
                  </a>
                </>
              </EmptyState>
            )}
          </div>
          <nav className={'pagination'} aria-label={'페이지 이동'}>
            {Array.from({ length: r.pages }, (_, i) => i + 1).map((p, rowIndex5) => (
              <a
                key={rowIndex5}
                href={
                  '/?' +
                  new URLSearchParams({ ...Object.fromEntries(params), page: String(p) }).toString() +
                  '#directory'
                }
                className={cn({ active: p === r.page })}
                aria-current={p === r.page ? 'page' : undefined}
                data-filter-link={''}
              >
                {p}
              </a>
            ))}
          </nav>
          <nav className={'mobile-only mobile-pagination'} aria-label={'도구 목록 페이지'}>
            {r.page > 1 ? (
              <a href={href('page', String(r.page - 1))} data-filter-link={''} data-page-link={''}>
                {'\n            ← 이전\n          '}
              </a>
            ) : (
              <span>{'← 이전'}</span>
            )}
            <span>
              <strong>{r.page}</strong>
              {' / '}
              {r.pages}
            </span>
            {r.page < r.pages ? (
              <a href={href('page', String(r.page + 1))} data-filter-link={''} data-page-link={''}>
                {'\n            다음 →\n          '}
              </a>
            ) : (
              <span>{'다음 →'}</span>
            )}
          </nav>
          <a className={'mobile-only mobile-suggest'} href={'/services/new'}>
            {'소개하고 싶은 도구가 있나요? '}
            <span>{'SaaS 등록하기 +'}</span>
          </a>
        </section>
      </div>
    </>
  );
}
