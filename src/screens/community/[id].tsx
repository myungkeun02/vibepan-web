import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import type { PageData } from '../../contracts/community/[id]';

import Mascot from '../../components/Mascot';

import Base from '../../layouts/Base';

import Comment from '../../components/Comment';

import { markdown, plainText } from '../../lib/markdown';

import { boards } from '../../lib/config';

import { getApp } from '../../lib/apps';

import { serviceHref } from '../../lib/services';
export default async function Viewidastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { p, linkedService, user, comments, build, reactions } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        pageKind={'post'}
        mobileTitle={'이야기'}
        mobileBack={'/community'}
        title={p?.title || '게시글을 찾을 수 없어요'}
        description={p ? plainText(p.body).slice(0, 150) : undefined}
        noindex={!p}
      >
        <div className={'narrow'} style={styleObject('margin:auto')}>
          {p ? (
            <>
              <header className={'page-head'}>
                <a className={'eyebrow'} href={'/community?board=' + p.board}>
                  {boards[p.board as keyof typeof boards]}
                </a>
                <h1>{p.title}</h1>
                <div className={'post-meta'}>
                  <a href={p.user_id ? '/profile/' + p.user_id : undefined}>
                    {p.nickname || '탈퇴한 사용자'}
                  </a>
                  <time dateTime={p.created_at}>{p.created_at.slice(0, 10)}</time>
                  {linkedService && <a href={serviceHref(linkedService)}>{linkedService.name}</a>}
                  {p.tool_slug && (
                    <a href={'/' + p.tool_slug}>{getApp(p.tool_slug)?.nameKo || '공개가 종료된 도구'}</a>
                  )}
                </div>
                {p.tags && <p className={'muted small'}>{p.tags}</p>}
              </header>
              <article className={'prose'} dangerouslySetInnerHTML={{ __html: markdown(p.body) }} />
              {Object.values(build).some(Boolean) && (
                <section className={'meta-box'}>
                  <h2>{'제작 과정 정리'}</h2>
                  {[
                    ['agent', 'AI 코딩 도구'],
                    ['features', '만든 기능'],
                    ['difficulties', '어려웠던 점'],
                    ['scope', '실제 대체 범위'],
                    ['prompt', '사용한 프롬프트'],
                  ].map(
                    ([k, label]) =>
                      build[k] && (
                        <div style={styleObject('margin:18px 0')}>
                          <h3>{label}</h3> <pre>{build[k]}</pre>
                        </div>
                      ),
                  )}
                  <div className={'flex wrap-flex'}>
                    {build.url && (
                      <a
                        className={'button secondary'}
                        href={build.url}
                        target={'_blank'}
                        rel={'nofollow ugc noopener'}
                      >
                        {'\n                    작품 보기 ↗\n                  '}
                      </a>
                    )}
                    {build.repo && (
                      <a
                        className={'button secondary'}
                        href={build.repo}
                        target={'_blank'}
                        rel={'nofollow ugc noopener'}
                      >
                        {'\n                    소스 보기 ↗\n                  '}
                      </a>
                    )}
                  </div>
                </section>
              )}
              <div className={'flex wrap-flex post-actions'}>
                <button
                  className={'button secondary'}
                  data-react={'like'}
                  data-post={p.id}
                  aria-pressed={reactions.like}
                >
                  {'\n              좋아요 '}
                  {p.likes}
                </button>
                <button
                  className={'button secondary'}
                  data-react={'bookmark'}
                  data-post={p.id}
                  aria-pressed={reactions.bookmark}
                >
                  {reactions.bookmark ? '저장했어요 ✓' : '글 저장 ☆'}
                </button>
                <button className={'button secondary'} data-copy-url={''}>
                  {'\n              링크 복사\n            '}
                </button>
                {p.user_id === user?.id && p.board !== 'notice' && (
                  <>
                    <a className={'small'} href={'/community/' + p.id + '/edit'}>
                      {'\n                  글 수정\n                '}
                    </a>
                    <form
                      className={'inline-form'}
                      data-api={''}
                      data-confirm={'이 글과 댓글을 삭제할까요?'}
                      action={'/api/posts/delete'}
                      method={'post'}
                    >
                      <input name={'csrf'} type={'hidden'} defaultValue={ctx.locals.csrf} />
                      <input name={'id'} type={'hidden'} defaultValue={p.id} />
                      <button className={'text-button danger'} type={'submit'}>
                        {'\n                    글 삭제\n                  '}
                      </button>
                    </form>
                  </>
                )}
              </div>
              {user && (
                <details className={'section'}>
                  <summary className={'small muted'}>{'게시글 신고하기'}</summary>
                  <form
                    data-api={''}
                    action={'/api/report'}
                    method={'post'}
                    style={styleObject('margin-top:15px')}
                  >
                    <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                    <input type={'hidden'} name={'type'} defaultValue={'post'} />
                    <input type={'hidden'} name={'target'} defaultValue={p.id} />
                    <label className={'form-field'}>
                      <span>{'신고 사유'}</span>
                      <textarea
                        name={'reason'}
                        required={true}
                        minLength={5}
                        maxLength={1000}
                        defaultValue={''}
                      />
                    </label>
                    <button type={'submit'} className={'button secondary'}>
                      {'\n                  신고 접수\n                '}
                    </button>
                    <p className={'form-status'} role={'status'} />
                  </form>
                </details>
              )}
              <section className={'section divider'}>
                <h2>
                  {'\n              댓글 '}
                  <span className={'count-label'}>{p.comments}</span>
                </h2>
                {comments
                  .filter((c) => !c.parent_id)
                  .map((c) => (
                    <>
                      <Comment comment={c} />
                      {comments
                        .filter((r) => r.parent_id === c.id)
                        .map((r, rowIndex1) => (
                          <Comment key={rowIndex1} comment={r} />
                        ))}
                    </>
                  ))}
                {!comments.length && <p className={'muted'}>{'아직 댓글이 없어요. 첫 댓글을 남겨보세요.'}</p>}
                {user ? (
                  <form
                    data-api={''}
                    action={'/api/comments/create'}
                    method={'post'}
                    style={styleObject('margin-top:24px')}
                  >
                    <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                    <input type={'hidden'} name={'post'} defaultValue={p.id} />
                    <label className={'form-field'}>
                      <span>{'댓글 남기기'}</span>
                      <textarea
                        name={'body'}
                        required={true}
                        maxLength={3000}
                        placeholder={'궁금한 점이나 응원을 남겨주세요.'}
                        defaultValue={''}
                      />
                    </label>
                    <button type={'submit'} className={'primary'}>
                      {'\n                  댓글 등록 ↗\n                '}
                    </button>
                    <p className={'form-status'} role={'status'} />
                  </form>
                ) : (
                  <a
                    className={'button secondary'}
                    href={'/login?returnTo=' + encodeURIComponent('/community/' + p.id)}
                  >
                    {'\n                로그인하고 댓글 남기기 ↗\n              '}
                  </a>
                )}
              </section>
            </>
          ) : (
            <section className={'page-head empty'}>
              <>
                <Mascot size={'large'} /> <h1>{'게시글을 찾을 수 없어요.'}</h1>
                <p>{'삭제되었거나 운영 정책에 따라 숨겨진 글입니다.'}</p>
                <a className={'button'} href={'/community'}>
                  {'\n              커뮤니티로 돌아가기\n            '}
                </a>
              </>
            </section>
          )}
        </div>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { p, linkedService, user, comments, build, reactions } = ctx.locals.presentation.data as PageData;
  return createMetadata(
    {
      title: p?.title || '게시글을 찾을 수 없어요',
      description: p ? plainText(p.body).slice(0, 150) : undefined,
      noindex: !p,
    },
    ctx.url.pathname,
  );
}
