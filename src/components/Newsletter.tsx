import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import Mascot from './Mascot';
export default async function ViewNewsletterastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = await getPageContext();

  const { csrf } = ctx.locals;
  return (
    <>
      <section className={'newsletter'}>
        <div className={'newsletter-heading'}>
          <div className={'eyebrow'}>{'이메일 알림'}</div>
          <Mascot size={'small'} />
        </div>
        <h2 style={styleObject('margin-top:12px')}>{'업데이트 소식 받기'}</h2>
        <p>{'\n    새로 추가된 도구와 제작 가이드를 이메일로 받습니다.\n  '}</p>
        <form data-api={''} action={'/api/waitlist'} method={'post'}>
          <input type={'hidden'} name={'csrf'} defaultValue={csrf} />
          <label className={'honeypot'} aria-hidden={'true'}>
            {'홈페이지'}
            <input name={'website'} tabIndex={-1} autoComplete={'off'} />
          </label>
          <label className={'form-field'}>
            <span>{'이메일'}</span>
            <input
              type={'email'}
              name={'email'}
              placeholder={'you@example.com'}
              required={true}
              autoComplete={'email'}
            />
          </label>
          <label className={'check-label'}>
            <input type={'checkbox'} name={'consent'} required={true} />
            {'업데이트 이메일 수신에 동의해요. 언제든 수신을 거부할\n      수 있어요.'}
          </label>
          <button className={'primary'} type={'submit'}>
            {'소식 받아보기 ↗'}
          </button>
          <p className={'form-status'} role={'status'} />
        </form>
      </section>
    </>
  );
}
