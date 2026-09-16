import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import type { PageData } from '../contracts/login';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';
export default async function Viewloginastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { returnTo, providers } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base title={'로그인'} noindex={true}>
        <section className={'auth-panel'}>
          <BrandIntro>
            <h1>{'로그인'}</h1>
            <p className={'muted'}>{'가입한 계정으로 로그인해 주세요.'}</p>
          </BrandIntro>
          {ctx.url.searchParams.has('error') && (
            <p className={'form-status error'} role={'alert'}>
              {
                '\n          소셜 로그인을 완료하지 못했어요. 이메일 계정이 있다면 이메일로 로그인해 주세요.\n        '
              }
            </p>
          )}
          {ctx.url.searchParams.has('updated') && (
            <p className={'form-status'}>{'비밀번호를 변경했어요. 다시 로그인해 주세요.'}</p>
          )}
          <form data-api={''} action={'/api/auth/login'} method={'post'}>
            <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
            <input type={'hidden'} name={'returnTo'} defaultValue={returnTo} />
            <label className={'form-field'}>
              <span>{'이메일'}</span>
              <input name={'email'} type={'email'} autoComplete={'email'} required={true} maxLength={254} />
            </label>
            <label className={'form-field'}>
              <span>{'비밀번호'}</span>
              <input
                name={'password'}
                type={'password'}
                autoComplete={'current-password'}
                required={true}
                maxLength={128}
              />
            </label>
            <button type={'submit'} className={'primary'}>
              {'로그인 ↗'}
            </button>
            <p className={'form-status'} role={'status'} />
          </form>
          <div className={'auth-links'}>
            <a href={'/forgot'}>{'비밀번호를 잊으셨나요?'}</a>
            <a href={'/signup?returnTo=' + encodeURIComponent(returnTo)}>{'회원가입 ↗'}</a>
          </div>
          <div className={'auth-divider'}>
            {providers.length ? (
              providers.map(([id, label], rowIndex1) => (
                <a
                  key={rowIndex1}
                  className={'button secondary'}
                  style={styleObject('width:100%;margin-bottom:10px')}
                  href={'/auth/' + id + '?returnTo=' + encodeURIComponent(returnTo)}
                >
                  {label}
                  {' 계정으로 로그인\n            '}
                </a>
              ))
            ) : (
              <p className={'muted small'}>
                {
                  '\n            소셜 로그인은 준비 중이에요. 이메일로 가입하고 모든 기본 기능을 이용할 수 있어요.\n          '
                }
              </p>
            )}
          </div>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { returnTo, providers } = ctx.locals.presentation.data as PageData;
  return createMetadata({ title: '로그인', noindex: true }, ctx.url.pathname);
}
