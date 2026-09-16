import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import Base from '../layouts/Base';
export default async function Viewverifyemailastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'이메일 주소 확인'} noindex={true}>
        <section className={'auth-panel'}>
          <h1>{'내 이메일 주소 확인'}</h1>
          <p>
            {
              '\n      본인이 요청한 확인 메일이라면 아래 버튼을 눌러 주세요. 링크는 30분 동안 한 번 사용할 수 있습니다.\n    '
            }
          </p>
          <form data-api={''} action={'/api/auth/verify-email'} method={'post'}>
            <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
            <input type={'hidden'} name={'token'} defaultValue={ctx.url.searchParams.get('token') || ''} />
            <button type={'submit'} className={'primary'}>
              {'이메일 주소 확인'}
            </button>
            <p className={'form-status'} role={'status'}></p>
          </form>
          <a href={'/me'}>{'내 활동으로 이동'}</a>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '이메일 주소 확인', noindex: true }, ctx.url.pathname);
}
