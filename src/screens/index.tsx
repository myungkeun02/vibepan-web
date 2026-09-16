import DirectorySearch from '../components/DirectorySearch';
import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/index';

import Mascot from '../components/Mascot';

import EmptyState from '../components/EmptyState';

import Base from '../layouts/Base';

import Directory from '../components/Directory';

import CatalogSummary from '../components/CatalogSummary';

import Newsletter from '../components/Newsletter';

import UiIcon from '../components/UiIcon';

import { categories } from '../lib/apps';

import { boards } from '../lib/config';
export default async function Viewindexastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { recent, r, jsonld } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        pageKind={'home'}
        title={'이 도구, 바이브코딩으로 대체할 수 있을까?'}
        jsonld={jsonld}
        noindex={ctx.url.search.length > 0}
      >
        <section className={'hero'}>
          <div>
            <div className={'desktop-only'}>
              <div className={'eyebrow'}>
                <span className={'status-dot'} />
                {' 도구별 기능 분석과 제작 가이드'}
              </div>
              <h1>
                {'\n          이 도구,'}
                <br />
                <span className={'accent'}>{'직접 만들 수 있을까?'}</span>
              </h1>
              <p>
                {'\n          직접 만들 수 있는 기능과 어려운 부분을 정리했습니다.'}
                <br />
                {'도구를 고르고, AI에 입력할 제작 프롬프트를\n          확인하세요.\n        '}
              </p>
            </div>
            <div className={'mobile-only mobile-home-intro'}>
              <p>
                {r.all.length}
                {'개 SaaS와 제작 가이드'}
              </p>
              <h1>
                {'\n          어떤 도구를 찾으세요'}
                <span className={'accent'}>{'?'}</span>
              </h1>
            </div>
            <DirectorySearch />
          </div>
          <aside>
            <div className={'terminal home-guide'}>
              <Mascot />
              <div>
                <div className={'cmd'}>{'직접 만들기 전에'}</div>
                <strong>{'필요한 기능과 제작 범위를 확인하세요.'}</strong>
                <br />
                {'기능별 난이도와 운영에 드는 비용을 정리했습니다.\n        '}
              </div>
            </div>
            <div style={styleObject('margin-top:17px')}>
              {[
                ['yes', '대체 가능', '정해진 범위는 직접 만들 만해요'],
                ['kinda', '일부 대체 가능', '기존 도구와 함께 써야 해요'],
                ['no', '대체 어려움', '핵심 기능까지 만들기는 어려워요'],
              ].map(([v, en, ko], rowIndex1) => (
                <div key={rowIndex1} className={'legend-row'}>
                  <>
                    <span className={cn(['verdict', v])} style={styleObject('font-size:12px')}>
                      <i className={'dot'} /> {en}
                    </span>
                    <span className={'muted small'}>{ko}</span>
                  </>
                </div>
              ))}
            </div>
            <div className={'eyebrow'} style={styleObject('margin-top:17px')}>
              {'\n        SaaS '}
              {r.all.length}
              {'개 · '}
              {categories.length}
              {'개 분야\n      '}
            </div>
          </aside>
        </section>
        <CatalogSummary />
        <Directory />
        <div className={'home-bottom'}>
          <section>
            <div className={'flex between'}>
              <h2>{'최근 제작 후기'}</h2>
              <a className={'small muted'} href={'/community?board=builds'}>
                {'후기 전체 보기'}
              </a>
            </div>
            {recent.map((p, rowIndex2) => (
              <a key={rowIndex2} className={'post-preview'} href={'/community/' + p.id}>
                <>
                  <span className={'eyebrow'}>{boards[p.board]}</span> <h3>{p.title}</h3>
                  <p>
                    {p.nickname || '탈퇴한 사용자'}
                    {' · 댓글 '}
                    {p.comments}
                  </p>
                </>
              </a>
            ))}
            {!recent.length && (
              <EmptyState compact={true}>
                <>
                  <h3>{'아직 등록된 제작 후기가 없습니다.'}</h3>
                  <p>{'만든 기능과 사용한 도구, 어려웠던 점을 적어주세요.'}</p>
                  <a href={'/community/new?board=builds'} className={'button secondary'}>
                    {'\n                제작 후기 남기기 ↗\n              '}
                  </a>
                </>
              </EmptyState>
            )}
          </section>
          <Newsletter />
        </div>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { recent, r, jsonld } = ctx.locals.presentation.data as PageData;
  return createMetadata(
    { title: '이 도구, 바이브코딩으로 대체할 수 있을까?', noindex: ctx.url.search.length > 0 },
    ctx.url.pathname,
  );
}
