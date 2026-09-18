import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import Base from '../../layouts/Base';

import PostEditor from '../../components/PostEditor';
export default async function Viewnewastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base
        title={'글쓰기'}
        pageKind={'editor'}
        mobileTitle={'글쓰기'}
        mobileBack={'/community'}
        noindex={true}
      >
        <header className={'page-head'}>
          <h1 style={styleObject('margin-top:12px')}>{'글쓰기'}</h1>
          <p>{'만든 도구나 궁금한 점을 공유해 주세요.'}</p>
        </header>
        <PostEditor />
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '글쓰기', noindex: true }, ctx.url.pathname);
}
