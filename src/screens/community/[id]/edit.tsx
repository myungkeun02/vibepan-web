import { createMetadata } from '../../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../../lib/jsx';
import { getPageContext } from '../../../lib/server-context';

import type { PageData } from '../../../contracts/community/[id]/edit';

import Base from '../../../layouts/Base';

import PostEditor from '../../../components/PostEditor';
export default async function Vieweditastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { p, allowed } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        title={'이야기 수정'}
        pageKind={'editor'}
        mobileTitle={'이야기 수정'}
        mobileBack={'/community/' + ctx.params.id}
        noindex={true}
      >
        <header className={'page-head'}>
          <h1>{allowed ? '이야기 수정' : '이 글을 수정할 수 없어요.'}</h1>
        </header>
        {allowed && <PostEditor post={p} />}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { p, allowed } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '이야기 수정', noindex: true }, ctx.url.pathname);
}
