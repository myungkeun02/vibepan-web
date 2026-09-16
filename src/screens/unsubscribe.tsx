import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import Base from '../layouts/Base';

import BrandIntro from '../components/BrandIntro';
export default async function Viewunsubscribeastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'업데이트 수신 거부'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'업데이트 수신 거부'}</h1>
            <p className={'muted'}>
              {'\n        아래 버튼을 누르면 더 이상 업데이트 소식을 보내지 않아요.\n      '}
            </p>
          </BrandIntro>
          <form data-api={''} action={'/api/waitlist/withdraw'} method={'post'}>
            <input name={'csrf'} type={'hidden'} defaultValue={ctx.locals.csrf} />
            <input name={'token'} type={'hidden'} defaultValue={ctx.url.searchParams.get('token') || ''} />
            <button className={'primary'} type={'submit'}>
              {'수신 거부하기'}
            </button>
            <p className={'form-status'} role={'status'} />
          </form>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '업데이트 수신 거부', noindex: true }, ctx.url.pathname);
}
