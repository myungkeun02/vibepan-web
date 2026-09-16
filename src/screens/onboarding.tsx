import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';
export default async function Viewonboardingastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'소셜 계정 가입 완료'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'가입을 마무리해 주세요'}</h1>
            <p className={'muted'}>
              {'\n        연결한 소셜 계정으로 가입합니다. 공개할 닉네임을 정해 주세요.\n      '}
            </p>
          </BrandIntro>
          <form data-api={''} method={'post'} action={'/api/auth/oauth-register'}>
            <input name={'csrf'} type={'hidden'} defaultValue={ctx.locals.csrf} />
            <label className={'form-field'}>
              <span>{'닉네임'}</span>
              <input name={'nickname'} required={true} minLength={2} maxLength={24} />
            </label>
            <label className={'check-label'}>
              <input type={'checkbox'} name={'terms'} required={true} />
              <span>
                <a href={'/terms'} target={'_blank'}>
                  {'이용약관'}
                </a>
                {'과 '}
                <a href={'/privacy'} target={'_blank'}>
                  {'개인정보 처리 안내'}
                </a>
                {'를 읽고 동의합니다.'}
              </span>
            </label>
            <button type={'submit'} className={'primary'}>
              {'가입 완료 ↗'}
            </button>
            <p role={'status'} className={'form-status'} />
          </form>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '소셜 계정 가입 완료', noindex: true }, ctx.url.pathname);
}
