import { createMetadata } from '../../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../../lib/jsx';
import { getPageContext } from '../../../lib/server-context';

import type { PageData } from '../../../contracts/services/edits/[id]';

import Base from '../../../layouts/Base';

import EmptyState from '../../../components/EmptyState';

import ServiceChanges from '../../../components/ServiceChanges';

import { serviceHref } from '../../../lib/services';

import { editStatuses } from '../../../lib/service-schema';
export default async function Viewidastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { e } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        title={'SaaS 수정 제안'}
        pageKind={'service-edit-review'}
        noindex={true}
        mobileTitle={'수정 제안'}
        mobileBack={'/me#my-service-edits'}
      >
        {e ? (
          <section className={'section narrow'}>
            <header className={'page-head'}>
              <>
                <h1>
                  {e.name}
                  {' 수정 제안'}
                </h1>
                <p className={'badge'} data-edit-status={''}>
                  {editStatuses[e.status]}
                </p>
                <p className={'muted small'}>{'등록한 수정 제안은 본인과 운영자만 볼 수 있습니다.'}</p>
              </>
            </header>
            <p className={'service-description'}>{e.reason}</p>
            {e.review_note && (
              <p className={'service-review-note'}>
                {'운영자 안내: '}
                {e.review_note}
              </p>
            )}
            <ServiceChanges edit={e} />
            <div className={'section flex wrap-flex'}>
              <a
                className={'button secondary'}
                href={serviceHref({ id: e.service_id, catalog_slug: e.catalog_slug || null })}
              >
                {'\n            현재 공개된 내용 보기\n          '}
              </a>
              {e.status === 'pending' && e.user_id === ctx.locals.user.id && (
                <form
                  data-api={''}
                  action={'/api/services/edits/cancel'}
                  method={'post'}
                  data-confirm={'이 수정 제안을 취소할까요?'}
                >
                  <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                  <input type={'hidden'} name={'id'} defaultValue={e.id} />
                  <button className={'text-button'} type={'submit'}>
                    {'\n                제안 취소\n              '}
                  </button>
                  <p className={'form-status'} role={'status'} />
                </form>
              )}
            </div>
          </section>
        ) : (
          <EmptyState>
            <>
              <h1>{'수정 제안을 찾을 수 없습니다.'}</h1> <a href={'/me'}>{'내 활동으로'}</a>
            </>
          </EmptyState>
        )}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { e } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: 'SaaS 수정 제안', noindex: true }, ctx.url.pathname);
}
