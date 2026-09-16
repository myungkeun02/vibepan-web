import { createMetadata } from '../../lib/metadata';
import type { ReactNode } from 'react';
import { cn, styleObject, Select } from '../../lib/jsx';
import { getPageContext } from '../../lib/server-context';

import type { PageData } from '../../contracts/category/[cat]';

import Base from '../../layouts/Base';

import Directory from '../../components/Directory';

import Mascot from '../../components/Mascot';
export default async function Viewcatastro(props: Record<string, any> & { children?: ReactNode }) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { cat, params, list, jsonld } = ctx.locals.presentation.data as PageData;
  return (
    <>
      <Base
        title={cat ? cat.name + ' 도구, 직접 만들 수 있을까?' : '카테고리를 찾을 수 없어요'}
        jsonld={jsonld}
        noindex={!cat}
      >
        <div className={cn(['page-head', { empty: !cat }])}>
          {!cat && <Mascot size={'large'} />} <div className={'eyebrow'}>{'분야별 도구 찾기'}</div>
          <h1> {cat ? cat.emoji + ' ' + cat.name : '카테고리를 찾을 수 없어요'} </h1>
          <p>
            {cat
              ? '직접 만들 수 있는 기능과 만들기 어려운 기능을 비교해 보세요.'
              : '주소를 확인하거나 전체 도구에서 다시 찾아보세요.'}
          </p>
          {!cat && (
            <a href={'/'} className={'button'}>
              {'\n          도구 탐색으로 돌아가기\n        '}
            </a>
          )}
        </div>
        {cat && <Directory params={params} />}
      </Base>
    </>
  );
}

export async function pageMetadata(props: Record<string, any>) {
  const ctx = { ...(await getPageContext()), params: await (props.params || {}) };

  const { cat, params, list, jsonld } = ctx.locals.presentation.data as PageData;
  return createMetadata(
    { title: cat ? cat.name + ' 도구, 직접 만들 수 있을까?' : '카테고리를 찾을 수 없어요', noindex: !cat },
    ctx.url.pathname,
  );
}
