import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import type { PageData } from '../../contracts/services/[id]';

import Base from '../../layouts/Base';

import EmptyState from '../../components/EmptyState';

import ServiceGuide from '../../components/ServiceGuide';

import PostRow from '../../components/PostRow';

import { servicePricing, serviceStatuses } from '../../lib/service-schema';

import { categoryName } from '../../lib/apps';
export default async function Viewidastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { s, builds, owner } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        title={s?.name || '서비스를 찾을 수 없어요'}
        description={s?.tagline}
        pageKind={'service-detail'}
        mobileTitle={'SaaS 소개'}
        mobileBack={'/'}
        noindex={!s || s.status !== 'published'}
      >
        {s ? (
          <article className={'service-detail'}>
            {owner && (
              <aside className={'service-review-status'} role={'status'}>
                <strong>{serviceStatuses[s.status]}</strong>
                <p>
                  {s.status === 'pending'
                    ? '운영자가 확인하고 있어요. 공개 전에는 등록자와 운영자만 이 페이지를 볼 수 있어요.'
                    : s.status === 'published'
                      ? 'SaaS 목록에 공개된 서비스예요.'
                      : '아래 안내를 확인하고 내용을 수정해 다시 검토를 요청할 수 있어요.'}
                </p>
                {s.review_note && <p className={'service-review-note'}>{s.review_note}</p>}
              </aside>
            )}
            <header className={'page-head'}>
              <>
                <div className={'eyebrow'}>{categoryName(s.category)}</div> <h1>{s.name}</h1>
                {(s.status === 'published' || owner) && (
                  <a className={'small accent'} href={'/services/' + s.id + '/edit'}>
                    {'\n                정보 수정\n              '}
                  </a>
                )}
                <p>{s.tagline}</p>
                <div className={'flex wrap-flex'}>
                  <>
                    <a
                      className={'button'}
                      href={s.website_url}
                      target={'_blank'}
                      rel={'nofollow ugc noopener noreferrer'}
                    >
                      {'\n                  서비스 방문하기 ↗\n                '}
                    </a>
                    <span className={'muted'}>{servicePricing[s.pricing]}</span>
                  </>
                </div>
              </>
            </header>
            {s.image_id && (
              <img
                className={'service-detail-image'}
                src={'/media/' + s.image_id}
                alt={s.name + ' 소개 이미지'}
                width={'960'}
                height={'600'}
              />
            )}
            <section className={'section'}>
              <>
                <h2>{'서비스 소개'}</h2> <p className={'service-description'}>{s.description}</p>
              </>
            </section>
            <ServiceGuide guide={s.guide} editUrl={'/services/' + s.id + '/edit'} />
            <section className={'section'}>
              <div className={'flex between wrap-flex'}>
                <>
                  <h2>{'제작 후기'}</h2>
                  <a className={'small'} href={'/community/new?board=builds&tool=service:' + s.id}>
                    {'\n                후기 작성\n              '}
                  </a>
                </>
              </div>
              {builds.length ? (
                builds.map((p) => <PostRow post={p} />)
              ) : (
                <p className={'muted'}>{'아직 등록된 제작 후기가 없습니다.'}</p>
              )}
            </section>
            <p className={'muted small'}>
              {s.nickname}
              {'님이 등록 · '}
              {s.created_at.slice(0, 10)}
              {' · 수정 제안으로 내용을 보완할 수 있습니다.\n        '}
            </p>
            {owner && (
              <div className={'service-owner-actions'}>
                <a className={'button secondary'} href={'/services/' + s.id + '/edit'}>
                  {'\n              등록 정보 수정\n            '}
                </a>
                <form
                  data-api={''}
                  action={'/api/services/delete'}
                  method={'post'}
                  data-confirm={'등록한 SaaS를 삭제할까요? 목록에서도 사라져요.'}
                >
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <input type={'hidden'} name={'id'} defaultValue={s.id} />
                  <input type={'hidden'} name={'revision'} defaultValue={s.revision} />
                  <button type={'submit'} className={'text-button danger'}>
                    {'\n                등록 삭제\n              '}
                  </button>
                  <p className={'form-status'} role={'status'} />
                </form>
              </div>
            )}
            <p className={'section'}>
              <a href={'/#directory'}>{'← SaaS 목록으로'}</a>
            </p>
          </article>
        ) : (
          <div className={'section'}>
            <EmptyState>
              <>
                <h1>{'서비스를 찾을 수 없어요.'}</h1> <p>{'아직 공개되지 않았거나 삭제된 서비스예요.'}</p>
                <a href={'/#directory'} className={'button'}>
                  {'\n              SaaS 목록으로\n            '}
                </a>
              </>
            </EmptyState>
          </div>
        )}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { s, builds, owner } = ctx.locals.presentation.data as PageData;
  return createMetadata(
    {
      title: s?.name || '서비스를 찾을 수 없어요',
      description: s?.tagline,
      noindex: !s || s.status !== 'published',
    },
    ctx.url.pathname,
  );
}
