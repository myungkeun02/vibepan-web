import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';

import { mailAvailable } from '../lib/mail';
export default async function Viewforgotastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'비밀번호 재설정 요청'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'비밀번호를 잊으셨나요?'}</h1>
            <p className={'muted'}>{'\n        가입한 이메일로 재설정 안내를 보내드려요.\n      '}</p>
          </BrandIntro>
          {(await mailAvailable()) ? (
            <form data-api={''} action={'/api/auth/forgot'} method={'post'}>
              <>
                <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
                <label className={'form-field'}>
                  <>
                    <span>{'이메일'}</span> <input type={'email'} name={'email'} required={true} />
                  </>
                </label>
                <button type={'submit'} className={'primary'}>
                  {'\n              재설정 안내 요청\n            '}
                </button>
                <p className={'form-status'} role={'status'} />
              </>
            </form>
          ) : (
            <p className={'empty'}>{'이메일 발송 설정을 준비 중입니다.'}</p>
          )}
          <a href={'/login'} className={'small'}>
            {'로그인으로 돌아가기'}
          </a>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '비밀번호 재설정 요청', noindex: true }, ctx.url.pathname);
}
