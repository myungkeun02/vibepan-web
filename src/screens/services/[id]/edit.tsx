import { createMetadata } from '../../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../../lib/jsx';
import { getPageContext } from '../../../lib/server-context';

import type { PageData } from '../../../contracts/services/[id]/edit';

import Base from '../../../layouts/Base';

import ServiceEditor from '../../../components/ServiceEditor';

import EmptyState from '../../../components/EmptyState';
export default async function Vieweditastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { s, allowed } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        title={'SaaS 정보 수정'}
        pageKind={'service-editor'}
        mobileTitle={'SaaS 정보 수정'}
        mobileBack={'/services/' + ctx.params.id}
        noindex={true}
      >
        <section className={'service-form-wrap'}>
          {allowed ? (
            <>
              <>
                <header className={'page-head'}>
                  <>
                    <h1>{'SaaS 정보 수정'}</h1>
                    <p>{'기존 정보와 제작 가이드를 수정해 제안할 수 있습니다.'}</p>
                  </>
                </header>
                <ServiceEditor service={s} />
              </>
            </>
          ) : (
            <div className={'section'}>
              <EmptyState>
                <>
                  <h1>{'이 서비스를 수정할 수 없어요.'}</h1>
                  <a className={'button'} href={'/services'}>
                    {'\n                SaaS 목록으로\n              '}
                  </a>
                </>
              </EmptyState>
            </div>
          )}
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { s, allowed } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: 'SaaS 정보 수정', noindex: true }, ctx.url.pathname);
}
