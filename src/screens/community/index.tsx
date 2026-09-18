import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import type { PageData } from '../../contracts/community/index';

import EmptyState from '../../components/EmptyState';

import Base from '../../layouts/Base';

import PostRow from '../../components/PostRow';

import Newsletter from '../../components/Newsletter';

import { boards } from '../../lib/config';
export default async function Viewindexastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { r } = ctx.locals.presentation.data as PageData;

  const link = (k: string, v: string) => {
    const p = new URLSearchParams(ctx.url.searchParams);
    p.delete('page');
    v ? p.set(k, v) : p.delete(k);
    return '/community?' + p;
  };
  return (
    <>
      <Base pageKind={'community'} title={'커뮤니티'} noindex={ctx.url.search.length > 0}>
        <header className={'mobile-only mobile-community-head'}>
          <h1>{'커뮤니티'}</h1>
          <p>{'만든 도구를 소개하고, 질문과 프롬프트를 나눠 보세요.'}</p>
        </header>
        <header className={'page-head desktop-only'}>
          <div className={'flex between wrap-flex'}>
            <h1 style={styleObject('margin-top:13px')}>{'커뮤니티'}</h1>
            <a className={'button'} href={'/community/new'}>
              {'글쓰기 +'}
            </a>
          </div>
          <p>{'만든 도구를 소개하고, 질문과 프롬프트를 나눠 보세요.'}</p>
        </header>
        <nav className={'tabs'} aria-label={'게시판'}>
          <a href={'/community'} className={cn({ active: !ctx.url.searchParams.get('board') })}>
            {'전체 글'}
          </a>
          {Object.entries(boards).map(([k, v], rowIndex1) => (
            <a
              key={rowIndex1}
              href={link('board', k)}
              className={cn({ active: ctx.url.searchParams.get('board') === k })}
            >
              {v}
            </a>
          ))}
        </nav>
        <div className={'community-layout'}>
          <section>
            <form className={'flex wrap-flex'} action={'/community'}>
              <input type={'hidden'} name={'board'} defaultValue={ctx.url.searchParams.get('board') || ''} />
              <input
                name={'q'}
                className={'field grow'}
                aria-label={'커뮤니티 검색'}
                placeholder={'제목이나 내용으로 찾아보세요'}
                defaultValue={ctx.url.searchParams.get('q') || ''}
              />
              <Select name={'sort'} aria-label={'글 정렬'}>
                <option value={'newest'}>{'최신순'}</option>
                <option value={'popular'} selected={ctx.url.searchParams.get('sort') === 'popular'}>
                  {'인기순'}
                </option>
              </Select>
              <button className={'button secondary'} type={'submit'}>
                {'검색'}
              </button>
            </form>
            {r.items.map((p) => (
              <PostRow post={p} />
            ))}
            {!r.total && (
              <div className={'community-empty'}>
                <EmptyState>
                  <>
                    <h3>
                      {ctx.url.searchParams.get('q') ? '검색 결과가 없습니다.' : '아직 등록된 글이 없습니다.'}
                    </h3>
                    <p>
                      {ctx.url.searchParams.get('q')
                        ? '검색어를 바꿔 보세요.'
                        : '질문이나 제작 후기를 남겨주세요.'}
                    </p>
                    <a className={'button secondary'} href={'/community/new'}>
                      {'\n                  글쓰기\n                '}
                    </a>
                  </>
                </EmptyState>
              </div>
            )}
            <nav className={'pagination'} aria-label={'게시글 페이지'}>
              {Array.from({ length: r.pages }, (_, i) => i + 1).map((p, rowIndex2) => (
                <a key={rowIndex2} href={link('page', String(p))} className={cn({ active: r.page === p })}>
                  {p}
                </a>
              ))}
            </nav>
          </section>
          <aside>
            <section className={'meta-box'}>
              <h3 style={styleObject('margin-top:15px')}>{'제작 후기 작성'}</h3>
              <p>{'\n          만든 기능, 사용한 도구, 실제 사용해 본 결과를 적어주세요.\n        '}</p>
              <a className={'small accent'} href={'/community/new?board=builds'}>
                {'후기 쓰기'}
              </a>
            </section>
            <Newsletter />
          </aside>
        </div>
        <a className={'mobile-only mobile-compose'} href={'/community/new'}>
          <span aria-hidden={'true'}>{'＋'}</span>
          {' 글쓰기'}
        </a>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { r } = ctx.locals.presentation.data as PageData;

  const link = (k: string, v: string) => {
    const p = new URLSearchParams(ctx.url.searchParams);
    p.delete('page');
    v ? p.set(k, v) : p.delete(k);
    return '/community?' + p;
  };
  return createMetadata({ title: '커뮤니티', noindex: ctx.url.search.length > 0 }, ctx.url.pathname);
}
