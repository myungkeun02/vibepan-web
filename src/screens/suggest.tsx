import { createMetadata } from '../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../lib/jsx';
import { getPageContext } from '../lib/server-context';

import BrandIntro from '../components/BrandIntro';

import Base from '../layouts/Base';

import { apps } from '../lib/apps';
export default async function Viewsuggestastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return (
    <>
      <Base title={'도구·정보 수정 제안'} noindex={true}>
        <section className={'narrow'} style={styleObject('margin:auto')}>
          <header className={'page-head'}>
            <BrandIntro>
              <h1>{'정보 수정 제안'}</h1>
              <p>{'가격, 기능 설명, 프롬프트에서 수정할 내용을 알려주세요.'}</p>
            </BrandIntro>
          </header>
          <p className={'service-suggest-link'}>
            {'\n      새로운 SaaS를 소개하려면 '}
            <a href={'/services/new'}>{'SaaS 등록하기 ↗'}</a>
          </p>
          <form data-api={''} action={'/api/suggest'} method={'post'}>
            <input type={'hidden'} name={'csrf'} defaultValue={ctx.locals.csrf} />
            <label className={'form-field'}>
              <span>{'관련 도구 (선택)'}</span>
              <Select name={'slug'} aria-label={'관련 도구 (선택)'}>
                <option value={''}>{'도구 선택 안 함'}</option>
                {apps.map((app, rowIndex1) => (
                  <option
                    key={rowIndex1}
                    value={app.slug}
                    selected={ctx.url.searchParams.get('slug') === app.slug}
                  >
                    {app.nameKo}
                    {' · '}
                    {app.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className={'form-field'}>
              <span>{'제안 제목'}</span>
              <input name={'title'} required={true} minLength={3} maxLength={140} />
            </label>
            <label className={'form-field'}>
              <span>{'수정할 내용과 참고 자료'}</span>
              <textarea
                name={'body'}
                required={true}
                minLength={10}
                maxLength={10000}
                style={styleObject('min-height:220px')}
                defaultValue={''}
              />
            </label>
            <p className={'muted small'}>
              {'\n        보내주신 내용과 자료를 검토한 뒤 도구 정보를 수정해요.\n      '}
            </p>
            <button type={'submit'} className={'primary'}>
              {'제안 보내기'}
            </button>
            <p className={'form-status'} role={'status'}></p>
          </form>
        </section>
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  return createMetadata({ title: '도구·정보 수정 제안', noindex: true }, ctx.url.pathname);
}
