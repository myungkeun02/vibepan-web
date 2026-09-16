import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';
export default async function Viewresetastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'새 비밀번호 설정'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'새 비밀번호 설정'}</h1>
          </BrandIntro>
          <form data-api={''} action={'/api/auth/reset'} method={'post'}>
            <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
            <input type={'hidden'} name={'token'} defaultValue={ctx.url.searchParams.get('token') || ''} />
            <label className={'form-field'}>
              <span>{'새 비밀번호'}</span>
              <input
                type={'password'}
                name={'password'}
                autoComplete={'new-password'}
                required={true}
                minLength={10}
                maxLength={128}
              />
            </label>
            <button type={'submit'} className={'primary'}>
              {'비밀번호 변경'}
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

  return createMetadata({ title: '새 비밀번호 설정', noindex: true }, ctx.url.pathname);
}
