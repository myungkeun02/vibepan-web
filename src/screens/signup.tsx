import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/signup';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';
export default async function Viewsignupastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { returnTo } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={'회원가입'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'회원가입'}</h1>
            <p className={'muted'}>
              {'\n        도구를 저장하고, SaaS를 등록하거나 글을 쓸 수 있어요.\n      '}
            </p>
          </BrandIntro>
          <form data-api={''} action={'/api/auth/register'} method={'post'}>
            <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
            <input type={'hidden'} name={'returnTo'} defaultValue={returnTo} />
            <label className={'form-field'}>
              <span>{'이메일'}</span>
              <input name={'email'} type={'email'} autoComplete={'email'} required={true} maxLength={254} />
            </label>
            <label className={'form-field'}>
              <span>{'닉네임'}</span>
              <input
                name={'nickname'}
                autoComplete={'nickname'}
                required={true}
                minLength={2}
                maxLength={24}
                placeholder={'한글·영문·숫자 2~24자'}
              />
            </label>
            <label className={'form-field'}>
              <span>{'비밀번호'}</span>
              <input
                name={'password'}
                type={'password'}
                autoComplete={'new-password'}
                required={true}
                minLength={10}
                maxLength={128}
                placeholder={'10자 이상 입력해 주세요'}
              />
            </label>
            <label className={'check-label'}>
              <input name={'terms'} type={'checkbox'} required={true} />
              <span>
                <a href={'/terms'} target={'_blank'}>
                  {'이용약관'}
                </a>
                {'과 '}
                <a href={'/privacy'} target={'_blank'}>
                  {'개인정보 처리 안내'}
                </a>
                {'를 읽고 동의해요. (필수)'}
              </span>
            </label>
            <label className={'check-label'}>
              <input name={'news'} type={'checkbox'} />
              {'업데이트 소식을 이메일로 받아볼게요. (선택)'}
            </label>
            <button type={'submit'} className={'primary'}>
              {'가입하기'}
            </button>
            <p className={'form-status'} role={'status'} />
          </form>
          <div className={'auth-links'}>
            <span className={'muted'}>{'이미 계정이 있나요?'}</span>
            <a href={'/login?returnTo=' + encodeURIComponent(returnTo)}>{'로그인'}</a>
          </div>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { returnTo } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '회원가입', noindex: true }, ctx.url.pathname);
}
