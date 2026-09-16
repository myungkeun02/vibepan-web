import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import Mascot from '../components/Mascot';

import Base from '../layouts/Base';
export default async function View404astro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'페이지를 찾을 수 없어요'} noindex={true}>
        <section className={'page-head empty'}>
          <Mascot size={'large'} />
          <div className={'eyebrow'}>{'404 · 페이지 없음'}</div>
          <h1>{'찾으시는 페이지가 없어요.'}</h1>
          <p>{'\n      주소가 바뀌었거나 삭제된 페이지일 수 있어요.\n    '}</p>
          <a href={'/'} className={'button'}>
            {'도구 탐색으로 돌아가기'}
          </a>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '페이지를 찾을 수 없어요', noindex: true }, ctx.url.pathname);
}
