import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/stats';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';

import CatalogSummary from '../components/CatalogSummary';

import PostRow from '../components/PostRow';

import ServiceCard from '../components/ServiceCard';
export default async function Viewstatsastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { t, recentBuilds, services, groups } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={'등록 현황'} pageKind={'stats'}>
        <header className={'page-head'}>
          <BrandIntro>
            <h1>{'등록 현황'}</h1>
            <p>{'현재 공개된 SaaS, 제작 가이드, 후기입니다.'}</p>
          </BrandIntro>
        </header>
        <CatalogSummary counts={t} />
        <p className={'muted small'}>{'검토 중이거나 숨김·삭제된 항목은 포함하지 않습니다.'}</p>
        <section className={'section'}>
          <div className={'flex between wrap-flex'}>
            <h2>{'최근 등록 SaaS'}</h2>
            <a href={'/#directory'} className={'small'}>
              {'전체 보기'}
            </a>
          </div>
          {services.items.length ? (
            <div className={'service-grid'}>
              {services.items.map((s, rowIndex1) => (
                <ServiceCard key={rowIndex1} service={s} />
              ))}
            </div>
          ) : (
            <div className={'content-empty'}>
              <>
                <p>{'아직 공개된 SaaS가 없습니다.'}</p> <a href={'/services/new'}>{'SaaS 등록하기'}</a>
              </>
            </div>
          )}
        </section>
        <section className={'section'}>
          <div className={'flex between wrap-flex'}>
            <h2>{'최근 제작 후기'}</h2>
            <a href={'/community?board=builds'} className={'small'}>
              {'전체 보기'}
            </a>
          </div>
          {recentBuilds.length ? (
            recentBuilds.map((p) => <PostRow post={p} />)
          ) : (
            <div className={'content-empty'}>
              <>
                <p>{'아직 등록된 제작 후기가 없습니다.'}</p>
                <a href={'/community/new?board=builds'}>{'후기 작성하기'}</a>
              </>
            </div>
          )}
        </section>
        <section className={'section'}>
          <h2>{'분야별 SaaS'}</h2>
          <nav className={'category-counts'} aria-label={'분야별 SaaS'}>
            {groups.map((c, rowIndex2) => (
              <a key={rowIndex2} href={'/category/' + c.slug}>
                <>
                  <span>{c.name}</span>
                  <strong>
                    {c.count}
                    {'개'}
                  </strong>
                </>
              </a>
            ))}
          </nav>
        </section>
        <section className={'section narrow prose'}>
          <h2>{'집계 기준'}</h2>
          <p>
            {
              '\n      등록 SaaS는 현재 공개된 모든 서비스의 수입니다. 제작 가이드는 그중 제작 범위와 프롬프트가 있는\n      항목입니다. 제작 후기는 ‘제작 후기·작품’ 게시판의 공개 글을 셉니다.\n    '
            }
          </p>
          <p>
            {
              '\n      후기 수는 글의 개수입니다. 제작 성공이나 비용 절감을 확인한 건수는 아닙니다. 도구별 ‘대체 경험’ 버튼\n      응답은 이 숫자에 포함하지 않습니다.\n    '
            }
          </p>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { t, recentBuilds, services, groups } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '등록 현황' }, ctx.url.pathname);
}
